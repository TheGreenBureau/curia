import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import strings from "@/locales/fi/strings.json";
import officerPositions from "@/locales/fi/officerPositions.json";
import positionAbbreviations from "@/locales/fi/positionAbbreviations.json";
import civilianPositions from "@/locales/fi/civilianPositions.json";

export const defaultNS = "strings";
export const resources = {
  fi: {
    strings,
    officerPositions,
    positionAbbreviations,
    civilianPositions,
  },
} as const;

i18next.use(initReactI18next).init({
  debug: true,
  fallbackLng: "fi",
  lng: "fi",
  defaultNS,
  ns: ["strings"],
  nsSeparator: ":",
  resources,
});

export default i18next;
