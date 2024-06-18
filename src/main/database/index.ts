import { Listing, ListingCore, ListingResult } from "data/Listing";
import writeFileAtomic from "write-file-atomic";
import { jsonTypeParse } from "@common/dataUtils";
import { DBEXT, RECENT } from "@paths";
import { getConfig } from "@configuration";
import path from "path";
import fs from "fs/promises";
import { selectFile, selectSaveLocation } from "@common/files/query";
import { formattedListingName } from "@common/listings/utils";
import { ListingQueryArgs } from "data/Listing";
import { filterForQuery } from "@common/listings/utils";
import { attachHandles } from "../ipc";
import { databaseChannel } from "@common/channels";
import { DatabaseAPI } from "app/api";

let currentListing: Listing | null = null;

const dbPath = async (id: string) => {
  const { dbDirectory } = await getConfig();
  return path.join(dbDirectory, `${id}${DBEXT}`);
};

const getListingCore = (db: Listing): ListingCore => {
  return {
    ...db,
  };
};

const getAllDatabaseFiles = async () => {
  const { dbDirectory } = await getConfig();
  const allFiles = await fs.readdir(dbDirectory);
  const files = allFiles.filter((f) => path.extname(f).toLowerCase() === DBEXT);
  return files;
};

export const createDatabaseDirectory = async () => {
  const { dbDirectory } = await getConfig();
  await fs.mkdir(dbDirectory, { recursive: true });
};

const writeToFile = async (db: Listing): Promise<Listing> => {
  const content = JSON.stringify(db);

  await writeFileAtomic(await dbPath(db.id), content, "utf8");
  return db;
};

const readFromFile = async (id: string): Promise<Listing> => {
  const fileContent = await fs.readFile(await dbPath(id), {
    encoding: "utf8",
  });
  const db = jsonTypeParse<Listing>(fileContent);
  return db;
};

const deleteFile = async (db: Listing): Promise<Listing> => {
  await fs.rm(await dbPath(db.id));
  return db;
};

const listRecent = async (): Promise<ListingCore[]> => {
  const recentRaw = await fs.readFile(RECENT, { encoding: "utf8" });
  const recent = jsonTypeParse<ListingCore[]>(recentRaw);

  return recent;
};

const addToRecents = async (db: ListingCore) => {
  try {
    const recent = await listRecent();

    if (typeof recent === "string") {
      console.log("No recents file or file unreadable. Creating...");

      await writeFileAtomic(RECENT, JSON.stringify([db]));
      return;
    }

    let filtered = recent.filter((r) => r.id !== db.id);
    filtered.unshift(db);
    if (filtered.length > 5) {
      filtered = filtered.slice(0, 5);
    }

    await writeFileAtomic(RECENT, JSON.stringify(filtered));
  } catch (err) {
    console.error(`Could not write to recents file: ${err}`);
  }
};

const removeFromRecents = async (db: ListingCore) => {
  try {
    const recent = await listRecent();

    if (typeof recent === "string") {
      console.log("No recents file found.");
      return;
    }

    const filtered = recent.filter((r) => r.id !== db.id);
    await writeFileAtomic(RECENT, JSON.stringify(filtered));
  } catch (err) {
    console.error(`Could not remove from recents: ${err}`);
  }
};

export const clearRecents = async () => {
  await writeFileAtomic(RECENT, "[]");
};

let cachedInfos: ListingCore[] | null = null;
let infoPath: string | null = null;

const filesAsInfos = async (files: string[]): Promise<ListingCore[]> => {
  const infos: ListingCore[] = [];
  for (let file of files) {
    try {
      const { dbDirectory } = await getConfig();
      const content = await fs.readFile(path.join(dbDirectory, file), {
        encoding: "utf8",
      });

      const core = getListingCore(jsonTypeParse<Listing>(content));
      infos.push(core);
    } catch {
      continue;
    }
  }

  return infos;
};

const refreshData = async () => {
  const files = await getAllDatabaseFiles();
  cachedInfos = await filesAsInfos(files);
};

const databaseHandles: DatabaseAPI = {
  createDatabase: async (listing: Listing) => {
    try {
      await writeToFile(listing);
    } catch (err) {
      return Promise.reject(err);
    }

    try {
      await addToRecents(getListingCore(listing));
    } finally {
      currentListing = listing;
      return listing;
    }
  },
  openDatabase: async (id: string) => {
    let result = await readFromFile(id);

    try {
      await addToRecents(getListingCore(result));
    } finally {
      currentListing = result;

      if (result === null) {
        throw new Error("No database found.");
      }

      return result;
    }
  },
  updateDatabase: async (db: Listing) => {
    try {
      await writeToFile(db);
    } catch (err) {
      return Promise.reject(err);
    }

    currentListing = db;
    return db;
  },
  getCurrentDatabase: async (): Promise<Listing | null> => {
    return await Promise.resolve(currentListing);
  },
  deselectDatabase: async () => {
    currentListing = null;
    return await Promise.resolve();
  },
  deleteDatabase: async (db: Listing) => {
    await deleteFile(db);

    try {
      await removeFromRecents(getListingCore(db));
    } finally {
      if (currentListing && currentListing.id === db.id) {
        currentListing = null;
      }
      return db;
    }
  },
  importDatabase: async (): Promise<Listing> => {
    const filePath = await selectFile("jtl");
    if (!filePath) return Promise.reject(new Error("Import cancelled."));

    if (path.extname(filePath) !== DBEXT) {
      throw new Error("Wrong file type");
    }

    let data: Listing;

    const rawData = await fs.readFile(filePath, { encoding: "utf8" });
    data = jsonTypeParse<Listing>(rawData);

    if (!data) throw new Error("Wrong file type");

    await writeToFile(data);

    const core = getListingCore(data);

    try {
      await addToRecents(core);
    } finally {
      currentListing = data;
      return data;
    }
  },
  exportDatabase: async (db: Listing): Promise<Listing> => {
    const { fileNameDateStart } = await getConfig();
    const filePath = await selectSaveLocation(
      `${formattedListingName(getListingCore(db), fileNameDateStart)}${DBEXT}`
    );

    if (!filePath) throw new Error("Export cancelled.");

    const rawData = JSON.stringify(db);
    await writeFileAtomic(filePath, rawData, "utf8");
    return db;
  },
  getDatabases: async ({
    limit,
    page,
    filters,
    fileNameStart,
    sortDirection,
    sortingHeader,
    refresh,
  }: ListingQueryArgs): Promise<ListingResult> => {
    if (!cachedInfos || refresh) {
      await refreshData();
    }

    const { language } = await getConfig();

    const filtered = filterForQuery(
      cachedInfos,
      filters,
      fileNameStart,
      language
    );
    const sorted = filtered;

    const startIndex = (page - 1) * limit;
    const excludedEndIndex = page * limit;

    if (startIndex < 0 || startIndex > sorted.length - 1)
      throw new Error("Out of bounds");

    const section = sorted.slice(
      startIndex,
      excludedEndIndex <= sorted.length ? excludedEndIndex : sorted.length
    );

    return {
      fileCount: sorted.length,
      pageCount: Math.ceil(sorted.length / limit),
      limit: limit,
      page: page,
      data: section,
    };
  },
  refreshDatabases: async () => {
    await refreshData();
  },
  clearRecents: async () => {
    await clearRecents();
  },
  getRecents: async () => {
    return await listRecent();
  },
};

export type DatabaseHandles = typeof databaseHandles;

export const databaseHandlesKeys = Object.keys(databaseHandles);

export function attachDatabaseHandles() {
  attachHandles(databaseHandles);
}
