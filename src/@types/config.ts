import { Language } from "@common/dataUtils";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { Officer } from "data/Persons";

export type Defaults = {
  court: DropdownOption | null;
  office: DropdownOption | null;
  department: DropdownOption | null;
  room: DropdownOption | null;
  presiding: Officer | null;
  secretary: Officer | null;
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
