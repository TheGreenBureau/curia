import fiPositions from "@locales/fi/peoplePositions.json";
import svPositions from "@locales/sv/peoplePositions.json";
import fiOfficerPositions from "@locales/fi/officerPositions.json";
import svOfficerPositions from "@locales/sv/officerPositions.json";
import { getAsArray, getAsOptions } from "@common/dataUtils";

export const getPositions = (lang: string) => {
  return getAsArray(fiPositions, svPositions, lang);
};

export const getPositionsAsOptions = (lang: string) => {
  return getAsOptions(fiPositions, svPositions, lang);
};

export const getOfficerPositions = (lang: string) => {
  return getAsArray(fiOfficerPositions, svOfficerPositions, lang);
};

export const getOfficerPositionsAsOptions = (lang: string) => {
  return getAsOptions(fiOfficerPositions, svOfficerPositions, lang);
};
