import { Customer } from "../entities/entitites";

// To be updated when requirements change

type IsoDateString = string;
export interface CustomerDTO extends Customer {
  lastSessionDate: IsoDateString;
}
