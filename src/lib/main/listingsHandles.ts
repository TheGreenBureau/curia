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
import { produce } from "immer";
import { parseCSV } from "../csv";

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
    const { defaults } = await getConfig();

    const csv = await importCSV();
    const parseResult = parseCSV(csv, type, defaults, currentListing);

    const updatedListing = produce(currentListing, (draft) => {
      draft.cases = parseResult.cases;
    });

    await writeToFile(updatedListing);

    currentListing = updatedListing;

    if (parseResult.errors?.length > 0) {
      return { errors: parseResult.errors };
    }

    return {};
  },
};

export function attachListingsHandles() {
  attachHandles(listingsHandles);
}
