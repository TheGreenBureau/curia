import { z } from "zod";

export const PersonBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type PersonBase = z.infer<typeof PersonBaseSchema>;

export const officerTypes = [
  "presiding",
  "secretary",
  "member",
  "layman",
  "prosecutor",
] as const;
export type OfficerType = (typeof officerTypes)[number];

export const OfficerTypeSchema = z.enum(officerTypes);

export const OfficerSchema = PersonBaseSchema.extend({
  type: OfficerTypeSchema,
  title: z.string().optional(),
});

export type Officer = z.infer<typeof OfficerSchema>;

export const civilianTypes = [
  "defendant",
  "injured",
  "witness",
  "expert",
  "plaintiff",
] as const;
export type CivilianType = (typeof civilianTypes)[number];

export const CivilianTypeSchema = z.enum(civilianTypes);

const commonSummons = ["personal", "video"] as const;
const defendantSpecificSummons = ["three", "nine"] as const;
const otherSpecificSummons = ["phone"] as const;

export const defendantSummons = [
  ...commonSummons,
  ...defendantSpecificSummons,
] as const;
export type DefendantSummons = (typeof defendantSummons)[number];

export const DefendantSummonsSchema = z.enum(defendantSummons);

export const otherSummons = [
  ...commonSummons,
  ...otherSpecificSummons,
] as const;
export type OtherSummons = (typeof otherSummons)[number];

export const OtherSummonsSchema = z.enum(otherSummons);

export const allSummons = [
  ...commonSummons,
  ...defendantSpecificSummons,
  ...otherSpecificSummons,
] as const;
export type AllSummons = (typeof allSummons)[number];

export const summonsStatuses = [
  "success",
  "failure",
  "warrant",
  "fetch",
] as const;
export type SummonsStatuses = (typeof summonsStatuses)[number];

export const CivilianSchema = PersonBaseSchema.extend({
  type: CivilianTypeSchema,
  counselor: z.string().optional(),
  trustee: z.string().optional(),
  representative: z.string().optional(),
  hasDemands: z.boolean().optional(),
  summonsType: z.enum(allSummons).optional(),
  summonsStatus: z.enum(summonsStatuses).optional(),
});

export type Civilian = z.infer<typeof CivilianSchema>;

export type SummonsQueryType = "defendant" | "other";

export type TitleQueryType = "court" | "layman" | "prosecutor";
