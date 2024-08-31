import strings from "@/locales/fi/strings.json";
import civilians from "@/locales/fi/civilianPositions.json";
import courts from "@/locales/fi/courts.json";
import courtTitles from "@/locales/fi/courtTitles.json";
import laymanTitles from "@/locales/fi/laymanTitles.json";
import officers from "@/locales/fi/officerPositions.json";
import positionAbbreviations from "@/locales/fi/positionAbbreviations.json";
import prosecutorTitles from "@/locales/fi/prosecutorTitles.json";
import summons from "@/locales/fi/summons.json";
import summonsStatus from "@/locales/fi/summonsStatus.json";
import { keys } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const resources = {
  strings,
  civilians,
  courts,
  courtTitles,
  laymanTitles,
  officers,
  positionAbbreviations,
  prosecutorTitles,
  summons,
  summonsStatus,
} as const;

export const civilianKeys = [...keys(civilians)] as const;

export const getCourtOffices = <CKey extends keyof typeof courts>(
  court: CKey
) => {
  return courts[court].offices;
};

export const courtKeys = keys(courts);
export type CourtKey = keyof typeof courts;
export type CourtData = (typeof courts)[(typeof courtKeys)[0]];

export const courtTitleKeys = [...keys(courtTitles)] as const;
export const laymanTitleKeys = [...keys(laymanTitles)] as const;
export const officerKeys = [...keys(officers)] as const;
export const positionAbbreviationKeys = [
  ...keys(positionAbbreviations),
] as const;
export const procecutorTitleKeys = [...keys(prosecutorTitles)] as const;
export const summonsKeys = [...keys(summons)] as const;
export const summonsStatusKeys = [...keys(summonsStatus)] as const;

export default resources;
