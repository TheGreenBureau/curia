import courtTitles from "@/locales/fi/courtTitles.json";
import prosecutorTitles from "@/locales/fi/prosecutorTitles.json";
import laymanTitles from "@/locales/fi/laymanTitles.json";

type PersonBase = {
  id: string;
  name: string;
};

export const officerTypes = [
  "presiding",
  "secretary",
  "member",
  "layman",
  "prosecutor",
] as const;
export type OfficerType = (typeof officerTypes)[number];

type PredefinedTitle =
  | keyof typeof courtTitles
  | keyof typeof laymanTitles
  | keyof typeof prosecutorTitles;

export type Officer = PersonBase & {
  type: OfficerType;
  title?: PredefinedTitle | string;
};

export const civilianTypes = [
  "defendant",
  "injured",
  "witness",
  "expert",
  "plaintiff",
] as const;
export type CivilianType = (typeof civilianTypes)[number];

const commonSummons = ["personal", "video"] as const;
const defendantSpecificSummons = ["three", "nine"] as const;
const otherSpecificSummons = ["phone"] as const;

export const defendantSummons = [
  ...commonSummons,
  ...defendantSpecificSummons,
] as const;
export type DefendantSummons = (typeof defendantSummons)[number];

export const otherSummons = [
  ...commonSummons,
  ...otherSpecificSummons,
] as const;
export type OtherSummons = (typeof otherSummons)[number];

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

export type Civilian = PersonBase & {
  type: CivilianType;
  counselor?: string;
  trustee?: string;
  representative?: string;
  hasDemands?: boolean;
  summonsType?: AllSummons;
  summonsStatus?: SummonsStatuses;
};

export type SummonsQueryType = "defendant" | "other";

export type TitleQueryType = "court" | "layman" | "prosecutor";
