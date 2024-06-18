import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import fiCourtTitles from "./locales/fi/courtTitles.json";
import fiDatabase from "./locales/fi/database.json";
import fiDefendantSummonTypes from "./locales/fi/defendantSummonsTypes.json";
import fiErrors from "./locales/fi/errors.json";
import fiFiles from "./locales/fi/files.json";
import fiGenericSummonsTypes from "./locales/fi/genericSummonsTypes.json";
import fiPeoplePositions from "./locales/fi/peoplePositions.json";
import fiProsecutorTitles from "./locales/fi/prosecutorTitles.json";
import fiSettings from "./locales/fi/settings.json";
import fiSummonsStatus from "./locales/fi/summonsStatus.json";
import fiTabs from "./locales/fi/tabs.json";
import fiWelcome from "./locales/fi/welcome.json";
import fiListings from "@locales/fi/listings.json";

export const defaultNS = "tabs";

i18next.use(initReactI18next).init({
  debug: true,
  fallbackLng: "fi",
  defaultNS,
  resources: {
    fi: {
      courtTitles: fiCourtTitles,
      database: fiDatabase,
      defendantSummonTypes: fiDefendantSummonTypes,
      errors: fiErrors,
      files: fiFiles,
      genericSummonsTypes: fiGenericSummonsTypes,
      peoplePositions: fiPeoplePositions,
      prosecutorTitles: fiProsecutorTitles,
      settings: fiSettings,
      summonsStatus: fiSummonsStatus,
      tabs: fiTabs,
      welcome: fiWelcome,
      listings: fiListings,
    },
  },
});

export default i18next;
