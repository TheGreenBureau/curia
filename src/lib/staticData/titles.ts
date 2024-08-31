import fiCourtTitles from "@/locales/fi/courtTitles.json";
import svCourtTitles from "@/locales/sv/courtTitles.json";
import fiProsecutorTitles from "@/locales/fi/prosecutorTitles.json";
import svProsecutorTitles from "@/locales/sv/prosecutorTitles.json";
import fiLaymanTitles from "@/locales/fi/laymanTitles.json";
import svLaymanTitles from "@/locales/sv/laymanTitles.json";
import { getDataAsOptions, getOption, isKey } from "@/lib/utils";
import { TitleQueryType } from "@/types/data/persons";

export const getTitles = (type: TitleQueryType, lang: string) => {
  switch (type) {
    case "court":
      return getDataAsOptions(fiCourtTitles, svCourtTitles, lang);
    case "layman":
      return getDataAsOptions(fiLaymanTitles, svLaymanTitles, lang);
    default:
      return getDataAsOptions(fiProsecutorTitles, svProsecutorTitles, lang);
  }
};

export const isDefinedTitle = (type: TitleQueryType, key: string) => {
  switch (type) {
    case "court":
      return isKey(fiCourtTitles, key);
    default:
      return isKey(fiProsecutorTitles, key);
  }
};

export const getTitle = (type: TitleQueryType, lang: string, id: string) => {
  switch (type) {
    case "court":
      return getOption(fiCourtTitles, svCourtTitles, lang, id);
    default:
      return getOption(fiProsecutorTitles, svProsecutorTitles, lang, id);
  }
};
