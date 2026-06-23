// entities designed for view needs 17/06/26

export interface Owner {
  id: number;
  firstname: string;
  dog: Dog;
  surname?: string;
  city?: string;
}

export interface Customer extends Owner {
  email?: string;
  passedForfaits?: CustomerForfait[];
  ongoingForfaits?: CustomerForfait[];
}

export interface Dog {
  id: number;
  name: string;
  age?: number;
  breed?: string;
  sex?: string;
}

export interface Forfait {
  id: number;
  name: string;
  numberOfSessions: number;
}

export interface CustomerForfait {
  id: number;
  type: string;
  numberOfSessions: number;
  passedSessions: Session[];
}

export interface Session {
  id: number;
  date: string;
  theme: string;
  content: string;
}