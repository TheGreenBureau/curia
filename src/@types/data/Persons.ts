import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";

type PersonBase = {
  id: string;
  name: string;
};

export type Counselor = PersonBase;

export type Trustee = PersonBase & {
  title?: string;
};

export type StaffMember = PersonBase & {
  title?: DropdownOption;
  presiding?: boolean;
};

export type Plaintiff = PersonBase & {
  title?: DropdownOption;
};

export type Defendant = PersonBase & {
  counselor?: Counselor;
  trustee?: Trustee;
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};

export type InjuredRepresentative = PersonBase;

export type OtherPerson = PersonBase & {
  type: "injured" | "witness" | "expert";
};

export type Injured = OtherPerson & {
  type: "injured";
  counselor?: Counselor;
  representative?: InjuredRepresentative;
  trustee?: Trustee;
  hasDemands?: boolean;
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};

export type Witness = OtherPerson & {
  type: "witness";
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};

export type Expert = OtherPerson & {
  type: "expert";
  title?: string;
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};
