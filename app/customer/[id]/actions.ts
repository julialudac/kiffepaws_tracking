"use server";

import { getCustomerById } from "@/actions";

export async function fetchCustomer(id: number) {
  return await getCustomerById(id);
}
