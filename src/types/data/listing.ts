import { Case } from "@/types/data/case";
import { Court } from "@/types/data/court";
import { Option } from "@/types/data/options";

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

export type ListingDocumentProps = {
  court: Court;
  department: string;
  room: string;
  date: Date;
  sessionBrake?: Date;
  cases: Case[];
  courtTitles: Option[];
  prosecutorTitles: Option[];
  laymanTitles: Option[];
  crimes: Option[];
};
