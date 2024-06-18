import fiCourtTitles from "@locales/fi/courtTitles.json";
import svCourtTitles from "@locales/sv/courtTitles.json";
import fiProsecutorTitles from "@locales/fi/prosecutorTitles.json";
import svProsecutorTitles from "@locales/sv/prosecutorTitles.json";
import {
  Language,
  getAsArray,
  getAsOptions,
  getOption,
  isKey,
} from "@common/dataUtils";

type TitleFetchType = "court" | "prosecutor";

export const getTitles = (type: TitleFetchType, lang: Language) => {
  switch (type) {
    case "court":
      return getAsArray(fiCourtTitles, svCourtTitles, lang);
    default:
      return getAsArray(fiProsecutorTitles, svProsecutorTitles, lang);
  }
};

export const getTitlesAsOptions = (type: TitleFetchType, lang: Language) => {
  switch (type) {
    case "court":
      return getAsOptions(fiCourtTitles, svCourtTitles, lang);
    default:
      return getAsOptions(fiProsecutorTitles, svProsecutorTitles, lang);
  }
};

export const isDefaultTitle = (type: TitleFetchType, key: string) => {
  switch (type) {
    case "court":
      return isKey(fiCourtTitles, key);
    default:
      return isKey(fiProsecutorTitles, key);
  }
};

export const getTitleOption = (
  type: TitleFetchType,
  lang: Language,
  id: string
) => {
  switch (type) {
    case "court":
      return getOption(fiCourtTitles, svCourtTitles, lang, id);
    default:
      return getOption(fiProsecutorTitles, svProsecutorTitles, lang, id);
  }
};
