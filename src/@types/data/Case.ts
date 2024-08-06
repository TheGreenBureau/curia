import { Defendant, OtherPerson, Plaintiff, StaffMember } from "./Persons";

export type Case = {
  id: string;
  caseNumber: string;
  prosecutorCaseNumber: string;
  matter: string;
  time: Date;
  type: "criminal" | "civil";
  members: StaffMember[];
  plaintiffs: Plaintiff[];
  defendants: Defendant[];
  other: OtherPerson[];
};
