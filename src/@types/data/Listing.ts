import { Case } from "./Case";

export type ListingCore = {
  id: string;
  creationDate: Date;
  date: Date;
  courtId: string;
  officeId?: string;
  departmentId?: string;
  roomId?: string;
};

export type Listing = {
  core: ListingCore;
  break?: Date;
  cases?: Case[];
};

export type ListingSummary = {
  id: string;
  creationDate: Date;
  date: Date;
  courtAbbreviation: string;
  officeName?: string;
  departmentName?: string;
  roomName?: string;
};
