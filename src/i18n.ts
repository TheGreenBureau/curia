import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import strings from "@/locales/fi/strings.json";
import officerPositions from "@/locales/fi/officerPositions.json";
import positionAbbreviations from "@/locales/fi/positionAbbreviations.json";
import civilianPositions from "@/locales/fi/civilianPositions.json";

import svStrings from "@/locales/sv/strings.json";
import svOfficerPositions from "@/locales/sv/officerPositions.json";
import svCivilianPositions from "@/locales/sv/civilianPositions.json";
import svPositionAbbreviations from "@/locales/sv/positionAbbreviations.json";

export const defaultNS = "strings";
export const resources = {
  fi: {
    strings,
    officerPositions,
    positionAbbreviations,
    civilianPositions,
  },
  sv: {
    strings: svStrings,
    officerPositions: svOfficerPositions,
    positionAbbreviations: svPositionAbbreviations,
    civilianPositions: svCivilianPositions,
  },
} as const;

i18next.use(initReactI18next).init({
  debug: true,
  fallbackLng: "fi",
  defaultNS,
  ns: ["strings"],
  nsSeparator: ":",
  resources,
});

export default i18next;
