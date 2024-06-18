import { Language } from "@common/dataUtils";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { StaffMember } from "data/Persons";

export type Defaults = {
  court: DropdownOption | null;
  office: DropdownOption | null;
  department: DropdownOption | null;
  room: DropdownOption | null;
  presiding: StaffMember | null;
  secretary: StaffMember | null;
  break: Date | null;
};

export interface AppConfig {
  readonly creationTime: Date;
  readonly modificationTime: Date;
  readonly dbDirectory: string;
  readonly defaults: Defaults;
  readonly fileNameDateStart: "year" | "day";
  readonly language: Language;
}
