import fiPositions from "@locales/fi/peoplePositions.json";
import svPositions from "@locales/sv/peoplePositions.json";
import { getAsArray, getAsOptions } from "@common/dataUtils";

export const getPositions = (lang: string) => {
  return getAsArray(fiPositions, svPositions, lang);
};

export const getPositionsAsOptions = (lang: string) => {
  return getAsOptions(fiPositions, svPositions, lang);
};
