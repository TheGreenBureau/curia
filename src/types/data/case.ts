import { Officer, Civilian } from "./persons";

export const caseType = ["criminal", "civil"] as const;
export type CaseType = (typeof caseType)[number];

export type Case = {
  id: string;
  caseNumber: string;
  prosecutorCaseNumber: string;
  matter: string;
  time: Date;
  type: CaseType;
  officers: Officer[];
  civilians: Civilian[];
  csv?: boolean;
  notes?: string;
};

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
