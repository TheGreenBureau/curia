import fiSummons from "@/locales/fi/summons.json";
import svSummons from "@/locales/sv/summons.json";
import fiStatus from "@/locales/fi/summonsStatus.json";
import svStatus from "@/locales/sv/summonsStatus.json";
import { Option } from "@/types/data/options";
import { getDataAsOptions } from "@/lib//utils";
import {
  defendantSummons,
  otherSummons,
  SummonsQueryType,
} from "@/types/data/persons";

export const getSummons = (lang: string, type: SummonsQueryType): Option[] => {
  return getDataAsOptions(fiSummons, svSummons, lang, {
    filterKeys:
      type === "defendant" ? [...defendantSummons] : [...otherSummons],
  });
};

export const getSummonsStatuses = (lang: string): Option[] => {
  return getDataAsOptions(fiStatus, svStatus, lang);
};
