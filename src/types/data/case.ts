import { Officer, Civilian, OfficerSchema, CivilianSchema } from "./persons";
import { z } from "zod";

export const caseType = ["criminal", "civil"] as const;
export type CaseType = (typeof caseType)[number];

export const CaseSchema = z.object({
  id: z.string(),
  caseNumber: z.string(),
  prosecutorCaseNumber: z.string(),
  matter: z.string(),
  time: z.coerce.date(),
  type: z.enum(caseType),
  officers: OfficerSchema.array(),
  civilians: CivilianSchema.array(),
  confidential: z.boolean().optional(),
  csv: z.boolean().optional(),
  notes: z.string().optional(),
});

export type Case = z.infer<typeof CaseSchema>;

export type CaseCSV = {
  "asia ID": string;
  asianimike: string;
  päiväys: string;
  alkamiskelloaika: string;
  "istunnon tyyppi": string;
  salitieto: string;
  esittäjät: string;
  kohteet: string;
  "syyttäjän asia ID": string;
};

export const isCaseCSV = (input: any): input is CaseCSV => {
  const schema: Record<keyof CaseCSV, true> = {
    "asia ID": true,
    asianimike: true,
    päiväys: true,
    alkamiskelloaika: true,
    "istunnon tyyppi": true,
    salitieto: true,
    esittäjät: true,
    kohteet: true,
    "syyttäjän asia ID": true,
  };

  const missingProperties = Object.keys(schema)
    .filter((key) => input[key] === undefined)
    .map((key) => key as keyof CaseCSV);

  if (missingProperties.length > 0) {
    throw new Error(
      `CSV document is missing the following properties: ${JSON.stringify(
        missingProperties
      )}`
    );
  }

  return true;
};
