import { z } from "zod";
import { Base, BaseSchema } from "@/types/data/queries";

export const OfficeSchema = z.object({
  id: z.string(),
  name: z.string(),
  rooms: BaseSchema.array(),
});

export type Office = z.infer<typeof OfficeSchema>;

export const CourtSchema = z.object({
  id: z.string(),
  name: z.string(),
  abbreviation: z.string(),
  offices: OfficeSchema.array(),
  departments: BaseSchema.array(),
});

export type Court = z.infer<typeof CourtSchema>;

export const AllCourtsSchema = CourtSchema.array();

export type AllCourts = z.infer<typeof AllCourtsSchema>;

/* export type Court = {
  id: string;
  name: string;
  abbreviation: string;
  offices: Record<string, Office>;
  departments: Record<string, string>;
} */

/*export type Office = {
  name: string;
  rooms: Record<string, string>;
}; */

export type CourtDetailType = "offices" | "departments";
