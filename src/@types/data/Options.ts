import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";

export type CourtOptions = {
  courts: DropdownOption[];
  offices: DropdownOption[];
  departments: DropdownOption[];
  rooms: DropdownOption[];
};

export type TitleOptions = {
  courtTitles: DropdownOption[];
  prosecutorTitles: DropdownOption[];
};

export type PersonOptions = {
  defendantSummons: DropdownOption[];
  genericSummons: DropdownOption[];
  summonsStatuses: DropdownOption[];
  positions: DropdownOption[];
};
