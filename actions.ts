"use server";

import path from "node:path";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { getUploadsDirectory } from "./utils";
import { JSON_SERVER_URL } from "./constants";
import { Customer, CustomerForfait, Session, Forfait, Upload } from "./entities/entitites";

export const getAllForfaits = async (): Promise<Forfait[]> => {
  try {
    const response = await fetch(JSON_SERVER_URL + "/forfaits");
    const data = await response.json();
    return data as Forfait[];
  } catch (error) {
    console.error("Error fetching forfaits:", error);
    throw error;
  }
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(JSON_SERVER_URL + "/customers");
    const data = await response.json();
    return data as Customer[];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/customers/${id}`);
    const data = await response.json();
    return data as Customer;
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
  await fetch(`${JSON_SERVER_URL}/customers/${customer.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
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