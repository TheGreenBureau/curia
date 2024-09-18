import { Case, CaseSchema } from "@/types/data/case";
import { Court } from "@/types/data/court";
import { Option } from "@/types/data/options";
import { z } from "zod";

export const ListingSchema = z.object({
  id: z.string(),
  creationDate: z.coerce.date(),
  date: z.coerce.date(),
  court: z.string(),
  office: z.string(),
  department: z.string(),
  room: z.string(),
  cases: CaseSchema.array(),
  break: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export type Listing = z.infer<typeof ListingSchema>;

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
