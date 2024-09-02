import { Listing } from "@/types/data/listing";
import writeFileAtomic from "write-file-atomic";
import { jsonTypeParse } from "@/lib/utils";
import { LISTINGS_EXT, RECENT } from "./paths";
import path from "path";
import fs from "fs/promises";
import { selectFile, selectSaveLocation } from "./files";
import { formatListingName } from "@/lib/utils";
import { attachHandles } from "./ipc";
import { ListingsAPI } from "@/types/config/api";
import { getCourt } from "@/lib/staticData/courts";
import { getConfig } from "./configHandles";
import { parse } from "csv-parse/sync";
import { Case, CaseCSV, CaseType, isCaseCSV } from "@/types/data/case";
import { v4 as uuidv4 } from "uuid";
import { Defaults } from "@/types/config/defaults";
import { Civilian, CivilianType, Officer } from "@/types/data/persons";
import { current, produce } from "immer";

let currentListing: Listing | null = null;

const listingPath = async (id: string) => {
  const { listingsDir } = await getConfig();

  return path.join(listingsDir, `${id}${LISTINGS_EXT}`);
};

const getAllListingFiles = async () => {
  const { listingsDir } = await getConfig();

  const allFiles = await fs.readdir(listingsDir);
  const files = allFiles.filter(
    (f) => path.extname(f).toLowerCase() === LISTINGS_EXT
  );

  return files;
};

export const createListingsDir = async () => {
  const { listingsDir } = await getConfig();

  await fs.mkdir(listingsDir, { recursive: true });
};

const writeToFile = async (listing: Listing): Promise<Listing> => {
  const content = JSON.stringify(listing);

  await writeFileAtomic(await listingPath(listing.id), content, "utf8");

  return listing;
};

const readFromFile = async (id: string): Promise<Listing> => {
  const fileContent = await fs.readFile(await listingPath(id), {
    encoding: "utf8",
  });

  const listing = jsonTypeParse<Listing>(fileContent);

  return listing;
};

const deleteFile = async (listingId: string): Promise<string> => {
  await fs.rm(await listingPath(listingId));

  return listingId;
};

const listRecent = async (): Promise<Listing[]> => {
  try {
    const recentRaw = await fs.readFile(RECENT, { encoding: "utf8" });
    const recent = jsonTypeParse<Listing[]>(recentRaw);

    return recent;
  } catch (err) {
    console.error(err);

    await writeFileAtomic(RECENT, "[]");
    return [];
  }
};

const addToRecents = async (listing: Listing) => {
  try {
    const recent = await listRecent();

    let filtered = recent.filter((r) => r.id !== listing.id);

    filtered.unshift(listing);

    if (filtered.length > 5) {
      filtered = filtered.slice(0, 5);
    }

    await writeFileAtomic(RECENT, JSON.stringify(filtered));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const removeFromRecents = async (listing: Listing | string) => {
  const recent = await listRecent();

  const filtered = recent.filter(
    (r) => r.id !== (typeof listing === "string" ? listing : listing.id)
  );

  await writeFileAtomic(RECENT, JSON.stringify(filtered));
};

export const clearRecents = async () => {
  await writeFileAtomic(RECENT, "[]");
};

const filesAsListings = async (files: string[]): Promise<Listing[]> => {
  const listings: Listing[] = [];

  for (let file of files) {
    try {
      const { listingsDir } = await getConfig();

      const content = await fs.readFile(path.join(listingsDir, file), {
        encoding: "utf8",
      });

      listings.push(jsonTypeParse<Listing>(content));
    } catch {
      continue;
    }
  }

  return listings;
};

const importCSV = async (): Promise<string> => {
  const filePath = await selectFile("csv");

  if (!filePath) throw new Error("Import cancelled.");

  if (path.extname(filePath).toLowerCase() !== ".csv") {
    throw new Error("Wrong file type.");
  }

  const data = await fs.readFile(filePath, { encoding: "utf8" });
  return data;
};

const importListing = async (): Promise<Listing> => {
  const filePath = await selectFile("jtl");

  if (!filePath) throw new Error("Import cancelled");

  if (path.extname(filePath) !== LISTINGS_EXT) {
    throw new Error("Wrong file type");
  }

  const rawData = await fs.readFile(filePath, { encoding: "utf8" });
  const data = jsonTypeParse<Listing>(rawData);

  if (!data) throw new Error("Wrong file type");

  await writeToFile(data);

  try {
    await addToRecents(data);
  } finally {
    currentListing = data;
    return data;
  }
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
    const parts = person.split(" ");
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

const processPlaintiffs = (plaints: string, currentCase: Case): Case => {
  const prosecutors: Officer[] = [];
  const plaintiffs: Civilian[] = [];

  const prosecPos = ["syyttäjä"];
  const plaintiffPos = ["kantaja"];

  const personsWithTitles = plaints.split(",");

  for (let person of personsWithTitles) {
    const parts = person.split(" ");
    const positionString = parts.pop();

    if (prosecPos.includes(positionString.toLowerCase())) {
      prosecutors.push({
        id: uuidv4(),
        name: parts.join(" "),
        type: "prosecutor",
      });
    } else if (plaintiffPos.includes(positionString.toLowerCase())) {
      plaintiffs.push({
        id: uuidv4(),
        name: parts.join(" "),
        type: "plaintiff",
      });
    }
  }

  return produce(currentCase, (draft) => {
    draft.officers = [...draft.officers, ...prosecutors];
    draft.civilians = [...draft.civilians, ...plaintiffs];
  });
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

  const current: Case = {
    id: uuidv4(),
    caseNumber: line["asia ID"].trim(),
    prosecutorCaseNumber: line["syyttäjän asia ID"].trim(),
    matter: line.asianimike.trim(),
    time: date,
    type: type,
    officers: [defaults.presiding, defaults.secretary],
    civilians: processCivilians(line.kohteet),
    csv: true,
  };

  return processPlaintiffs(line.esittäjät, current);
};

const parseCSV = async (type: CaseType) => {
  const csv = await importCSV();
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

  const { defaults } = await getConfig();

  for (let line of parsed) {
    if (isCaseCSV(line)) {
      cases.push(processCSVLine(line, defaults, type));
      continue;
    }

    errors.push(JSON.stringify(line, null, 2));
  }

  return {
    cases,
    errors: errors.length > 0 ? errors : undefined,
  };
};

const processCases = (csvCases: Case[]): Case[] => {
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
      results.push(csv);
      continue;
    }

    const resultCase = produce(currentCase, (draft) => {
      draft.matter = csv.matter;
      draft.time = csv.time;
      draft.prosecutorCaseNumber = csv.prosecutorCaseNumber;
      draft.officers = [
        ...draft.officers.filter((o) => o.type === "prosecutor"),
        ...csv.officers,
      ];
      draft.civilians = draft.civilians.filter(
        (c) =>
          c.type !== "defendant" ||
          csv.civilians.some((cc) => cc.name === c.name)
      );

      for (let civilian of csv.civilians) {
        if (!draft.civilians.some((civ) => civ.name === civilian.name)) {
          draft.civilians.push(civilian);
        }
      }
    });

    const resultIndex = results.findIndex((c) => c.id === currentCase.id);
    results[resultIndex] = resultCase;
  }

  return results;
};

const listingsHandles: ListingsAPI = {
  createListing: async (listing: Listing) => {
    await writeToFile(listing);

    try {
      await addToRecents(listing);
    } finally {
      currentListing = listing;
      return listing;
    }
  },

  openListing: async (id: string) => {
    let result = await readFromFile(id);

    try {
      await addToRecents(result);
    } finally {
      currentListing = result;

      if (result === null) {
        throw new Error("No listing found");
      }

      return result;
    }
  },

  updateListing: async (listing: Listing) => {
    await writeToFile(listing);

    currentListing = listing;
    return listing;
  },

  currentListing: async (): Promise<Listing | null> => {
    return await Promise.resolve(currentListing);
  },

  deselectCurrentListing: async () => {
    currentListing = null;
    return await Promise.resolve();
  },

  deleteListings: async (listings: string[]) => {
    const deleted: string[] = [];
    const errors: string[] = [];

    for (const listingId of listings) {
      try {
        await deleteFile(listingId);
        deleted.push(listingId);
      } catch {
        errors.push(listingId);
        continue;
      } finally {
        try {
          await removeFromRecents(listingId);
        } catch {
          continue;
        }
      }
    }

    if (currentListing && listings.includes(currentListing.id)) {
      currentListing = null;
    }

    return { deleted, errors };
  },

  importListing: importListing,

  exportListing: async (listing: Listing): Promise<Listing> => {
    const filePath = await selectSaveLocation(
      `${formatListingName(listing)}${LISTINGS_EXT}`
    );

    if (!filePath) throw new Error("Export cancelled");

    const rawData = JSON.stringify(listing);
    await writeFileAtomic(filePath, rawData, "utf8");

    return listing;
  },

  listings: async () => {
    const files = await getAllListingFiles();
    return await filesAsListings(files);
  },

  clearRecents: clearRecents,
  recents: listRecent,

  court: async ({ courtId, lang }) => {
    return getCourt(courtId, lang);
  },

  openCSV: async ({ type }) => {
    const results = await parseCSV(type);
    const processed = processCases(results.cases);

    currentListing = produce(currentListing, (draft) => {
      draft.cases = processed;
    });

    if (results.errors?.length > 0) {
      return { errors: results.errors };
    }

    return {};
  },
};

export function attachListingsHandles() {
  attachHandles(listingsHandles);
}
