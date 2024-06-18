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
};

export type Prosecutor = PersonBase & {
  title?: DropdownOption;
};

export type Plaintiff = PersonBase;

export type Defendant = PersonBase & {
  counselor?: Counselor;
  trustee?: Trustee;
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};

export type InjuredRepresentative = PersonBase;

export type Injured = PersonBase & {
  counselor?: Counselor;
  representative?: InjuredRepresentative;
  trustee?: Trustee;
  hasDemands?: boolean;
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};

export type Witness = PersonBase & {
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};

export type Expert = PersonBase & {
  title?: string;
  summonsType?: DropdownOption;
  summonsStatus?: DropdownOption;
};
