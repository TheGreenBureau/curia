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
