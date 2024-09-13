export type Court = {
  id: string;
  name: string;
  abbreviation: string;
  offices: Record<string, Office>;
  departments: Record<string, string>;
};

export type Office = {
  name: string;
  rooms: Record<string, string>;
};

export type CourtDetailType = "offices" | "departments";
