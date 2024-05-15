import {
  Defendant,
  Expert,
  Injured,
  Plaintiff,
  Prosecutor,
  StaffMember,
  Witness,
} from "./Persons";

export type Case = {
  id: string;
  caseNumber: string;
  prosecutorCaseNumber: string;
  matter: string;
  time: Date;
  presiding?: StaffMember;
  members?: StaffMember[];
  prosecutors?: Prosecutor[];
  plaintiffs?: Plaintiff[];
  defendants?: Defendant[];
  injured?: Injured[];
  witnesses?: Witness[];
  experts?: Expert[];
};
