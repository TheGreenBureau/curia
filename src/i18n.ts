import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ChainedBackend, { ChainedBackendOptions } from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import HttpBackend from "i18next-http-backend";
import strings from "@/locales/strings/fi.json";
import svStrings from "@/locales/strings/sv.json";

export const defaultNS = "strings";
export const resources = {
  fi: {
    strings,
  },
  sv: {
    strings: svStrings,
  },
} as const;

i18next
  .use(initReactI18next)
  .use(ChainedBackend)
  .init<ChainedBackendOptions>({
    debug: true,
    lng: localStorage.getItem("curia-ui-lang") === "sv" ? "sv" : "fi",
    fallbackLng: "fi",
    defaultNS,
    ns: ["strings"],
    backend: {
      backends: [HttpBackend, resourcesToBackend(resources)],
      backendOptions: [
        {
          loadPath:
            "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/{{ns}}/{{lng}}.json",
        },
      ],
    },
  });

export default i18next;
