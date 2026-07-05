"use server";

import { revalidatePath } from "next/cache";
import { JSON_SERVER_URL } from "./constants";
import { Customer, CustomerForfait, Session } from "./entities/entitites";

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
    for (const forfait of [...(customer.ongoingForfaits || []), ...(customer.passedForfaits || [])]) {
      const session = forfait.passedSessions.find((session) => session.id === sessionId);
      if (session) return { customer, forfait, session };
    }
  }
  return undefined;
};

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

    const customer = customers.find((c) =>
      c.ongoingForfaits?.some((f) => f.id === forfaitId)
    );
    if (!customer) return;

    const forfait = customer.ongoingForfaits?.find((f) => f.id === forfaitId);
    if (!forfait) return;

    forfait.passedSessions.push(session);
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
    await updateCustomer(customer);
  } catch (error) {
    console.error("Error removing session:", error);
    throw error;
  }
};
