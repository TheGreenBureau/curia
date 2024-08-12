import { Officer, Civilian } from "./Persons";

export type Case = {
  id: string;
  caseNumber: string;
  prosecutorCaseNumber: string;
  matter: string;
  time: Date;
  type: "criminal" | "civil";
  officers: Officer[];
  civilians: Civilian[];
};
