import type { Officer } from "../data/persons";

export type Defaults = {
  court: string;
  office: string;
  department: string;
  room: string;
  presiding: Officer | null;
  secretary: Officer | null;
  break: Date | null;
};
