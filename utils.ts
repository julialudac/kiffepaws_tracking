import { JSON_SERVER_URL, DOCS_DIRECTORY_URL } from "./constants";
import { Customer, Upload } from "./entities/entitites";

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

export const getDocumentUrl = (document: Upload) => {
  console.log(document)
  console.log(`${DOCS_DIRECTORY_URL}/${"doc" + document.id}-${document.filename}`)
  return `${DOCS_DIRECTORY_URL}/${document.filename}`
}