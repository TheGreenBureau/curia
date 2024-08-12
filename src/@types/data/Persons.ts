import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";

type PersonBase = {
  id: string;
  name: string;
};

export const officerTypes = [
  "presiding",
  "secretary",
  "member",
  "prosecutor",
] as const;
export type OfficerType = (typeof officerTypes)[number];

export type Officer = PersonBase & {
  type: OfficerType;
  title?: DropdownOption;
};

export type Civilian = PersonBase & {
  type: "defendant" | "injured" | "witness" | "expert" | "plaintiff";
  counselor?: string;
  trustee?: string;
  representative?: string;
  hasDemands?: boolean;
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};
