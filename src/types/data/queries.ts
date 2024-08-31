export type SortDirection = "asc" | "desc";

export type ArrayOptions<T extends Record<string, string>> = {
  filterKeys?: (keyof T)[];
};
