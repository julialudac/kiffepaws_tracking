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