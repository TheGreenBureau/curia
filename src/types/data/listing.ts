import { Case } from "./case";

export type Listing = {
  id: string;
  creationDate: Date;
  date: Date;
  court: string;
  office: string;
  department: string;
  room: string;
  cases: Case[];
  break?: Date;
  notes?: string;
};

export type PersonListingProps = {
  caseNumber: string;
  matter: string;
  caseID: string;
  caseIndex: number;
};
