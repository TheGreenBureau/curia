import { Listing, ListingSchema } from "@/types/data/listing";
import writeFileAtomic from "write-file-atomic";
import { LISTINGS_EXT, RECENT } from "./paths";
import path from "path";
import fs from "fs/promises";
import { selectFile, selectSaveLocation } from "./files";
import { attachHandles } from "./ipc";
import { ListingsAPI } from "@/types/config/api";
import { getConfig } from "./configHandles";
import { produce } from "immer";
import { parseCSV } from "../csv";

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

  const data = JSON.parse(fileContent);
  return ListingSchema.parse(data);
};

const deleteFile = async (listingId: string): Promise<string> => {
  await fs.rm(await listingPath(listingId));

  return listingId;
};

const listRecent = async (): Promise<Listing[]> => {
  try {
    const recentRaw = await fs.readFile(RECENT, { encoding: "utf8" });
    const data = JSON.parse(recentRaw);

    return ListingSchema.array().parse(data);
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

      const data = JSON.parse(content);

      listings.push(ListingSchema.parse(data));
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
  const dataUntyped = JSON.parse(rawData);

  const data = ListingSchema.parse(dataUntyped);

  await writeToFile(data);

  try {
    await addToRecents(data);
  } finally {
    return data;
  }
};

const listingsHandles: ListingsAPI = {
  createListing: async (listing: Listing) => {
    await writeToFile(listing);

    try {
      await addToRecents(listing);
    } finally {
      return listing;
    }
  },

  openListing: async (id: string) => {
    let result = await readFromFile(id);

    try {
      await addToRecents(result);
    } finally {
      return result;
    }
  },

  updateListing: async (listing: Listing) => {
    await writeToFile(listing);
    return listing;
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

    return { deleted, errors };
  },

  importListing: importListing,

  exportListing: async (listing: Listing): Promise<Listing> => {
    const filePath = await selectSaveLocation(`${listing.id}${LISTINGS_EXT}`);

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

  openCSV: async ({ currentListing }) => {
    const { defaults } = await getConfig();

    const csv = await importCSV();
    const parseResult = parseCSV(csv, defaults, currentListing);

    const updatedListing = produce(currentListing, (draft) => {
      draft.cases = parseResult.cases;
    });

    await writeToFile(updatedListing);

    return { listing: updatedListing, errors: parseResult.errors };
  },
};

export function attachListingsHandles() {
  attachHandles(listingsHandles);
}
