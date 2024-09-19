import { z } from "zod";
import { AllCourtsSchema } from "./court";
import { RecordSchema } from "./queries";

export const ResourcesSchema = z.object({
  courts: AllCourtsSchema,
  civilianPositions: RecordSchema,
  officerPositions: RecordSchema,
  positionAbbreviations: RecordSchema,
  summons: RecordSchema,
  summonsStatus: RecordSchema,
  courtTitles: RecordSchema,
  laymanTitles: RecordSchema,
  prosecutorTitles: RecordSchema,
});

export type Resources = z.infer<typeof ResourcesSchema>;
