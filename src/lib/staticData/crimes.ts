import crimesJSON from "@/locales/crimes/crimes.json";
import { Option } from "@/types/data/options";

export const getCrimesAsOptions = (lang: string) => {
  const language = lang === "fi" || lang === "sv" ? lang : "fi";

  const crimes: Option[] = crimesJSON
    .filter((c) => c.type === undefined)
    .map((crime) => {
      return {
        value: crime.fi,
        label: crime[language],
      };
    });

  return crimes;
};
