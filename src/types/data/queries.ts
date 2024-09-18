import { z } from "zod";

export type SortDirection = "asc" | "desc";

export type ArrayOptions<T extends Record<string, string>> = {
  filterKeys?: (keyof T)[];
};

export const BaseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Base = z.infer<typeof BaseSchema>;

export const RecordSchema = z.record(z.string(), z.string());

export type RecordType = z.infer<typeof RecordSchema>;
