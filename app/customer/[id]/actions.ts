"use server";

import { getCustomerById } from "@/utils";

export async function fetchCustomer(id: number) {
  return await getCustomerById(id);
}
