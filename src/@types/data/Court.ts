export type Court = {
  id: string;
  name: string;
  abbreviation: string;
  offices: Record<string, string>;
  departments: Record<string, string>;
  rooms: Record<string, string>;
};
