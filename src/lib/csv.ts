import { Defaults } from "@/types/config/defaults";
import { Case, CaseCSV, CaseType } from "@/types/data/case";
import { parse } from "csv-parse/sync";
import { isCaseCSV } from "@/types/data/case";
import { v4 as uuidv4 } from "uuid";
import { Civilian, CivilianType, Officer } from "@/types/data/persons";
import { Listing } from "@/types/data/listing";
import { produce } from "immer";

export const parseCSV = (
  csv: string,
  type: CaseType,
  defaults: Defaults,
  currentListing: Listing
) => {
  const parsed = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ";",
  });

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid CSV-file.");
  }

  const cases: Case[] = [];
  const errors: string[] = [];

  for (let line of parsed) {
    if (isCaseCSV(line)) {
      cases.push(processCSVLine(line, defaults, type));
      continue;
    }

    errors.push(JSON.stringify(line, null, 2));
  }

  const listingUpdatedCases = processCases(cases, currentListing, defaults);

  return {
    cases: listingUpdatedCases,
    errors: errors.length > 0 ? errors : undefined,
  };
};

const processCSVLine = (
  line: CaseCSV,
  defaults: Defaults,
  type: CaseType
): Case => {
  const dateparts = line.päiväys.trim().split(".");
  const timeparts = line.alkamiskelloaika.trim().split(":");

  const date = new Date();
  date.setFullYear(
    parseInt(dateparts[2]),
    parseInt(dateparts[1]),
    parseInt(dateparts[0])
  );
  date.setHours(parseInt(timeparts[0]), parseInt(timeparts[1]), 0, 0);

  const { prosecutors, plaintiffs } = processBearers(line.esittäjät);

  const current: Case = {
    id: uuidv4(),
    caseNumber: line["asia ID"].trim(),
    prosecutorCaseNumber: line["syyttäjän asia ID"].trim(),
    matter: line.asianimike.trim(),
    time: date,
    type: type,
    officers: [...prosecutors],
    civilians: [...processCivilians(line.kohteet), ...plaintiffs],
    csv: true,
  };

  return current;
};

const processBearers = (
  plaints: string
): { prosecutors: Officer[]; plaintiffs: Civilian[] } => {
  const prosecutors: Officer[] = [];
  const plaintiffs: Civilian[] = [];

  const prosecPos = ["syyttäjä"];
  const plaintiffPos = ["kantaja"];

  const personsWithTitles = plaints.split(",");

  for (let person of personsWithTitles) {
    const parts = person.split(" ").map((part) => part.trim());
    const positionString = parts.pop();

    if (prosecPos.includes(positionString.toLowerCase())) {
      prosecutors.push({
        id: uuidv4(),
        name: parts.join(" "),
        type: "prosecutor",
        title: "Aluesyyttäjä",
      });
    } else if (plaintiffPos.includes(positionString.toLowerCase())) {
      plaintiffs.push({
        id: uuidv4(),
        name: parts.join(" "),
        type: "plaintiff",
      });
    }
  }

  return {
    prosecutors,
    plaintiffs,
  };
};

type PositionType = {
  variants: string[];
  position: CivilianType;
};

const processCivilians = (civs: string): Civilian[] => {
  const positions: PositionType[] = [
    { variants: ["vastaaja"], position: "defendant" },
    { variants: ["asianomistaja"], position: "injured" },
    { variants: ["todistaja"], position: "witness" },
  ];

  return civs.split(",").map((person) => {
    const parts = person.split(" ").map((part) => part.trim());
    const positionString = parts.pop();

    const position = positions.find((p) =>
      p.variants.includes(positionString.toLowerCase())
    );

    const civilian: Civilian = {
      id: uuidv4(),
      name: parts.join(" "),
      type: position ? position.position : "defendant",
    };

    return civilian;
  });
};

const processCases = (
  csvCases: Case[],
  currentListing: Listing,
  defaults: Defaults
): Case[] => {
  // Filter deleted cases
  const results = currentListing.cases.filter(
    (c) => !c.csv || csvCases.some((csv) => csv.caseNumber === c.caseNumber)
  );

  // Add new cases and modify existing
  for (let csv of csvCases) {
    const currentCase = currentListing.cases.find(
      (c) => c.caseNumber === csv.caseNumber
    );

    if (!currentCase) {
      results.push({
        ...csv,
        officers: [defaults.presiding, defaults.secretary, ...csv.officers],
      });
      continue;
    }

    const resultCase = produce(currentCase, (draft) => {
      draft.matter = csv.matter;
      draft.time = csv.time;
      draft.prosecutorCaseNumber = csv.prosecutorCaseNumber;
      draft.officers = updatedProsecutors(currentCase.officers, csv.officers);
      draft.civilians = updatedCivilians(currentCase.civilians, csv.civilians);
    });

    const resultIndex = results.findIndex((c) => c.id === currentCase.id);
    results[resultIndex] = resultCase;
  }

  return results;
};

const updatedProsecutors = (
  currentOfficers: Officer[],
  csvProsecutors: Officer[]
) => {
  return [
    ...currentOfficers.filter((o) => o.type !== "prosecutor"),
    ...csvProsecutors,
  ];
};

const updatedCivilians = (
  currentCivilians: Civilian[],
  csvCivilians: Civilian[]
) => {
  const result = currentCivilians.filter(
    (civilian) =>
      civilian.type !== "defendant" ||
      csvCivilians.some((csvCiv) => csvCiv.name === civilian.name)
  );

  for (let civilian of csvCivilians) {
    if (
      currentCivilians.some(
        (civ) => civ.name === civilian.name && civ.type === civilian.type
      )
    ) {
      continue;
    }

    result.push(civilian);
  }

  return result;
};
