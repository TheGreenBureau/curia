import fiCivilianPositions from "@/locales/fi/civilianPositions.json";
import svCivilianPositions from "@/locales/sv/civilianPositions.json";
import fiOfficerPositions from "@/locales/fi/officerPositions.json";
import svOfficerPositions from "@/locales/sv/officerPositions.json";
import { getDataAsOptions } from "@/lib/utils";
import { CaseType } from "@/types/data/case";

export const getCivilianPositions = (lang: string, caseType: CaseType) => {
  const options = getDataAsOptions(
    fiCivilianPositions,
    svCivilianPositions,
    lang
  );

  return caseType === "civil"
    ? options
    : options.filter((o) => o.value !== "plaintiff");
};

export const getOfficerPositions = (lang: string) => {
  return getDataAsOptions(fiOfficerPositions, svOfficerPositions, lang);
};
