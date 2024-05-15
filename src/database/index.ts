import { Listing, ListingCore } from "data/Listing";
import { v4 as uuidv4 } from "uuid";
import { t } from "i18next";
import writeFileAtomic from "write-file-atomic";
import jsonTypeParse from "../utils/jsonTypeParse";
import { DBEXT, RECENT } from "../configuration/paths";
import { getConfig } from "../configuration";
import path from "path";
import fs from "fs";
import { selectFile, selectSaveLocation } from "../utils/files";
import { listingName } from "../utils/files";

const dbPath = (id: string) => {
  return path.join(getConfig().dbDirectory, `${id}${DBEXT}`);
};

const createDatabaseDirectory = () => {
  fs.mkdirSync(getConfig().dbDirectory, { recursive: true });
};

const writeToFile = async (db: Listing): Promise<Listing | string> => {
  const content = JSON.stringify(db);

  try {
    await writeFileAtomic(dbPath(db.core.id), content, "utf8");
    return db;
  } catch (err) {
    return `${t("errors:databaseJsonCreate")}: ${err}`;
  }
};

const readFromFile = async (id: string): Promise<Listing | string> => {
  try {
    const fileContent = await fs.promises.readFile(dbPath(id), {
      encoding: "utf8",
    });
    const db = jsonTypeParse<Listing>(fileContent);
    return db;
  } catch (err) {
    return `${t("errors:databaseJsonOpen")}: ${err}`;
  }
};

const deleteFile = async (db: Listing): Promise<Listing | string> => {
  try {
    await fs.promises.rm(dbPath(db.core.id));
    return db;
  } catch (err) {
    return `${t("errors:databaseJsonDelete")}: ${err}`;
  }
};

const listRecent = async (): Promise<ListingCore[] | string> => {
  try {
    const recentRaw = await fs.promises.readFile(RECENT, { encoding: "utf8" });
    const recent = jsonTypeParse<ListingCore[]>(recentRaw);

    return recent;
  } catch (err) {
    return `${t("errors:databaseRecent")}: ${err}`;
  }
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

const clearRecents = async () => {
  try {
    await writeFileAtomic(RECENT, "[]");
  } catch (err) {
    console.error(`${t("errors:databaseRecent")}: ${err}`);
  }
};

const createDatabase = async (date: Date, courtId: string) => {
  const config = getConfig();
  const currentDate = new Date();

  const database: Listing = {
    core: {
      id: uuidv4(),
      creationDate: currentDate,
      date: date,
      courtId: courtId,
      officeId: config.defaults.officeId,
      departmentId: config.defaults.departmentId,
      roomId: config.defaults.roomId,
    },
    break: config.defaults.break,
    cases: [],
  };

  const result = await writeToFile(database);
  if (typeof result !== "string") {
    await addToRecents(database.core);
  }
  return result;
};

const openDatabase = async (id: string) => {
  const result = await readFromFile(id);

  if (typeof result !== "string") {
    await addToRecents(result.core);
  }

  return result;
};

const updateDatabase = async (db: Listing) => {
  return writeToFile(db);
};

const deleteDatabase = async (db: Listing) => {
  const result = await deleteFile(db);

  if (typeof result !== "string") {
    await removeFromRecents(db.core);
  }

  return result;
};

const importDatabase = async (): Promise<ListingCore | string | undefined> => {
  const filePath = await selectFile("jtl");
  if (!filePath) return undefined;

  if (path.extname(filePath) !== DBEXT) {
    return t("errors:databaseWrongFileType");
  }

  try {
    const rawData = await fs.promises.readFile(filePath, { encoding: "utf8" });
    const data = jsonTypeParse<Listing>(rawData);

    if (!data) return t("errors:databaseWrongFileType");

    const result = await writeToFile(data);

    if (typeof result !== "string") {
      await addToRecents(result.core);
      return result.core;
    }

    return result;
  } catch (err) {
    return `${t("errors:databaseImportFail")}: ${err}`;
  }
};

const exportDatabase = async (
  db: Listing
): Promise<string | undefined | Listing> => {
  const filePath = await selectSaveLocation(`${listingName(db.core)}${DBEXT}`);
  if (!filePath) return undefined;

  try {
    const rawData = JSON.stringify(db);
    await writeFileAtomic(filePath, rawData, "utf8");
    return db;
  } catch (err) {
    return `${t("errors:databaseJsonCreate")}: ${err}`;
  }
};

const listAllDatabases = async () => {
  try {
    const allFiles = await fs.promises.readdir(getConfig().dbDirectory);
    const files = allFiles.filter(
      (f) => path.extname(f).toLowerCase() === DBEXT
    );

    const infos: ListingCore[] = [];
    for (let file of files) {
      try {
        const content = await fs.promises.readFile(
          path.join(getConfig().dbDirectory, file),
          { encoding: "utf8" }
        );

        const { core } = jsonTypeParse<Listing>(content);
        infos.push(core);
      } catch {
        continue;
      }
    }

    return infos;
  } catch (err) {
    return `${t("errors:databaseJsonOpen")}: ${err}`;
  }
};

export {
  createDatabaseDirectory,
  createDatabase,
  openDatabase,
  updateDatabase,
  deleteDatabase,
  listAllDatabases,
  listRecent,
  importDatabase,
  exportDatabase,
  clearRecents,
};
