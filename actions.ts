"use server";

import path from "node:path";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { getUploadsDirectory } from "./utils";
import { JSON_SERVER_URL } from "./constants";
import { Customer, CustomerForfait, Session, Forfait, Upload, Dog } from "./entities/entitites";
import { CustomerDTO } from "./dto/dto";

// json-server always serves (and stores) ids as strings, regardless of how they're
// typed in the underlying data file. The rest of the app treats ids as numbers, so
// every id is normalized to a number right after a fetch, and denormalized back to
// a string right before a write — keeping that quirk confined to this boundary
// instead of leaking `string | number` id types through the whole codebase.
const normalizeSession = (session: Session): Session => ({ ...session, id: Number(session.id) });

const normalizeForfait = (forfait: CustomerForfait): CustomerForfait => ({
  ...forfait,
  id: Number(forfait.id),
  passedSessions: forfait.passedSessions.map(normalizeSession),
});

const normalizeUpload = (upload: Upload): Upload => ({ ...upload, id: Number(upload.id) });

const normalizeDog = (dog: Dog): Dog => ({ ...dog, id: Number(dog.id) });

const normalizeCustomer = (customer: Customer): Customer => ({
  ...customer,
  id: Number(customer.id),
  dog: normalizeDog(customer.dog),
  customerForfaits: customer.customerForfaits?.map(normalizeForfait),
  documents: customer.documents?.map(normalizeUpload),
});

const denormalizeSession = (session: Session) => ({ ...session, id: String(session.id) });

const denormalizeForfait = (forfait: CustomerForfait) => ({
  ...forfait,
  id: String(forfait.id),
  passedSessions: forfait.passedSessions.map(denormalizeSession),
});

const denormalizeUpload = (upload: Upload) => ({ ...upload, id: String(upload.id) });

const denormalizeDog = (dog: Dog) => ({ ...dog, id: String(dog.id) });

const denormalizeCustomer = (customer: Customer) => ({
  ...customer,
  id: String(customer.id),
  dog: denormalizeDog(customer.dog),
  customerForfaits: customer.customerForfaits?.map(denormalizeForfait),
  documents: customer.documents?.map(denormalizeUpload),
});

export const getAllForfaits = async (): Promise<Forfait[]> => {
  try {
    const response = await fetch(JSON_SERVER_URL + "/forfaits");
    const data = await response.json();
    return (data as Forfait[]).map((forfait) => ({ ...forfait, id: Number(forfait.id) }));
  } catch (error) {
    console.error("Error fetching forfaits:", error);
    throw error;
  }
};

const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(JSON_SERVER_URL + "/customers");
    const data = await response.json();
    return (data as Customer[]).map(normalizeCustomer);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const parseDdMMyyyyDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  // Note: In JavaScript, months are 0-indexed (0 = January, 1 = February, ..., 11 = December)
  // Use UTC to avoid timezone shifts when converting to ISO strings (toISOString), like days "loosing" 1 day.
  return new Date(Date.UTC(year, month - 1, day));
};

const computeLastSessionDate = (customer: Customer): string => {
  const lastSessionDate = customer.customerForfaits?.flatMap((forfait) => forfait.passedSessions)
    .reduce((latest, session) => {
      // session.date is a string in the form "DD/MM/YYYY", we need to convert it to a Date object
      const sessionDate = parseDdMMyyyyDate(session.date);
      return sessionDate > latest ? sessionDate : latest;
    }, new Date(0));
  return lastSessionDate ? lastSessionDate.toISOString().split("T")[0] : "";
}

export const getAllCustomersDTO = async (): Promise<CustomerDTO[]> => {
  try {
    const customerEntities = await getAllCustomers();
    const customersDTO: CustomerDTO[] = customerEntities.map((customer) => ({ ...customer, lastSessionDate: computeLastSessionDate(customer) }));
    return customersDTO;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/customers/${id}`);
    const data = await response.json();
    return normalizeCustomer(data as Customer);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getCustomerDTOById = async (id: number): Promise<CustomerDTO> => {
  try {
    const customer = await getCustomerById(id);
    const lastSessionDate = computeLastSessionDate(customer);
    return { ...customer, lastSessionDate };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

type SessionLocation = {
  customer: Customer;
  forfait: CustomerForfait;
  session: Session;
};

const findSessionLocation = (customers: Customer[], sessionId: number): SessionLocation | undefined => {
  for (const customer of customers) {
    for (const forfait of customer.customerForfaits || []) {
      const session = forfait.passedSessions.find((session) => session.id === sessionId);
      if (session) return { customer, forfait, session };
    }
  }
  return undefined;
};

const findClientByClientForfaitId = (customers: Customer[], forfaitId: number): Customer | undefined => {
  const customer = customers.find((c) =>
    c.customerForfaits?.some((f) => f.id === forfaitId)
  );
  return customer;
}

const updateCustomer = async (customer: Customer): Promise<void> => {
  const payload = denormalizeCustomer(customer);
  await fetch(`${JSON_SERVER_URL}/customers/${payload.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  revalidatePath("/");
};


export const addPassedSessionToForfait = async (forfaitId: number, session: Session): Promise<void> => {
  try {
    const customers = await getAllCustomers();

    const customer = findClientByClientForfaitId(customers, forfaitId);
    if (!customer) return;

    const forfait = customer.customerForfaits?.find((f) => f.id === forfaitId);
    if (!forfait) return;

    forfait.passedSessions.push(session);
    if (forfait.passedSessions.length >= forfait.numberOfSessions) {
      forfait.isPassed = true;
    }
    await updateCustomer(customer);
  } catch (error) {
    console.error("Error adding session:", error);
    throw error;
  }
};

export const updateSessionById = async (
  id: number,
  data: { theme?: string; date?: string; content?: string }
): Promise<void> => {
  try {
    const customers = await getAllCustomers();
    const location = findSessionLocation(customers, id);
    if (!location) return;

    const { customer, session } = location;
    if (data.theme) session.theme = data.theme;
    if (data.date) session.date = data.date;
    if (data.content) session.content = data.content;
    await updateCustomer(customer);
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
};

export const removeSessionById = async (id: number): Promise<void> => {
  try {
    const customers = await getAllCustomers();
    const location = findSessionLocation(customers, id);
    if (!location) return;

    const { customer, forfait, session } = location;
    const sessionIndex = forfait.passedSessions.findIndex((s) => s.id === session.id);
    forfait.passedSessions.splice(sessionIndex, 1);
    if (forfait.isPassed && forfait.passedSessions.length < forfait.numberOfSessions) {
      forfait.isPassed = false;
    }
    await updateCustomer(customer);
  } catch (error) {
    console.error("Error removing session:", error);
    throw error;
  }
};

export const addForfaitToCustomer = async (customerId: number, forfait: Forfait): Promise<void> => {
  try {
    const customers = await getAllCustomers();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const newCustomerForfait: CustomerForfait = {
      id: Date.now(),
      type: forfait.name,
      numberOfSessions: forfait.numberOfSessions,
      passedSessions: [],
      isPassed: false,
    };

    if (!customer.customerForfaits) {
      customer.customerForfaits = [];
    }
    customer.customerForfaits.push(newCustomerForfait);
    await updateCustomer(customer);
  } catch (error) {
    console.error("Error adding forfait:", error);
    throw error;
  }
}

export const removeForfaitById = async (forfaitId: number): Promise<void> => {
  try {
    const customers = await getAllCustomers();
    const customer = findClientByClientForfaitId(customers, forfaitId);
    if (!customer) return;

    customer.customerForfaits = customer.customerForfaits?.filter((f) => f.id !== forfaitId);
    await updateCustomer(customer);
  } catch (error) {
    console.error("Error removing forfait:", error);
    throw error;
  }
};

const getDocumentFileName = (id: number, file: File): string => "doc" + id + "-" + file.name;

const uploadFile = async (file: File, id: number): Promise<Upload> => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = getDocumentFileName(id, file);
    const filePath = path.join(getUploadsDirectory(), filename);
    await writeFile(filePath, buffer);
    return { id, title: file.name, filename };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

const addDocumentRefToCustomer = async (customerId: number, document: Upload): Promise<void> => {
  try {
    const customers = await getAllCustomers();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    if (!customer.documents) {
      customer.documents = [];
    }
    customer.documents.push(document);
    await updateCustomer(customer);
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

export const attachDocumentToCustomer = async (customerId: number, file: File): Promise<void> => {
  try {
    const id = Date.now(); // Generate a unique ID for the document
    const document = await uploadFile(file, id);
    await addDocumentRefToCustomer(customerId, document);
  } catch (error) {
    console.error("Error attaching document to customer:", error);
    throw error;
  }
};

const findClientByDocumentId = (customers: Customer[], documentId: number): Customer | undefined => {
  return customers.find((c) => c.documents?.some((d) => d.id === documentId));
};

export const removeDocumentById = async (documentId: number): Promise<void> => {
  try {
    const customers = await getAllCustomers();
    const customer = findClientByDocumentId(customers, documentId);
    if (!customer) return;

    // We only remove the reference to the document, the file itself stays on the server.
    customer.documents = customer.documents?.filter((d) => d.id !== documentId);
    await updateCustomer(customer);
  } catch (error) {
    console.error("Error removing document:", error);
    throw error;
  }
};