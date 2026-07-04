"use server";

import { revalidatePath } from "next/cache";
import { JSON_SERVER_URL } from "./constants";
import { Customer } from "./entities/entitites";

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

export const removeSessionById = async (id: number): Promise<void> => {
  try {
    const customers = await getAllCustomers();

    for (const customer of customers) {
      for (const forfait of customer.ongoingForfaits || []) {
        const sessionIndex = forfait.passedSessions.findIndex((session) => session.id === id);
        if (sessionIndex !== -1) {
          forfait.passedSessions.splice(sessionIndex, 1);
          await fetch(`${JSON_SERVER_URL}/customers/${customer.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(customer),
          });
          revalidatePath("/");
          return;
        }
      }

      for (const forfait of customer.passedForfaits || []) {
        const sessionIndex = forfait.passedSessions.findIndex((session) => session.id === id);
        if (sessionIndex !== -1) {
          forfait.passedSessions.splice(sessionIndex, 1);
          await fetch(`${JSON_SERVER_URL}/customers/${customer.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(customer),
          });
          revalidatePath("/");
          return;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
