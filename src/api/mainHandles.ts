import { ipcMain } from "electron";
import {
  createDatabase,
  openDatabase,
  deleteDatabase,
  updateDatabase,
  listAllDatabases,
  listRecent,
  importDatabase,
  exportDatabase,
} from "../database/index";
import { DEFAULT_DB_DIR } from "../configuration/paths";
import {
  chooseDatabaseLocation,
  getConfig,
  setConfig,
  setDatabaseDefaultLocation,
} from "../configuration";
import { Listing } from "data/Listing";
import { ConfigResult } from "api";
import { Defaults } from "config";

export default function attachHandles() {
  ipcMain.handle(
    "db:create",
    async (_event, date: Date, courtId: string) =>
      await createDatabase(date, courtId)
  );

  ipcMain.handle(
    "db:open",
    async (_event, id: string) => await openDatabase(id)
  );

  ipcMain.handle(
    "db:update",
    async (_event, db: Listing) => await updateDatabase(db)
  );

  ipcMain.handle(
    "db:delete",
    async (_event, db: Listing) => await deleteDatabase(db)
  );

  ipcMain.handle("db:list", async () => await listAllDatabases());

  ipcMain.handle("db:recent", async () => await listRecent());

  ipcMain.handle("db:import", async () => await importDatabase());

  ipcMain.handle(
    "db:export",
    async (_event, db: Listing) => await exportDatabase(db)
  );

  ipcMain.handle("config:getListingsLocation", async () => {
    const location = getConfig().dbDirectory;

    const result: ConfigResult = {
      dbLocation: location,
      isDefault: location === DEFAULT_DB_DIR,
    };

    return result;
  });

  ipcMain.handle(
    "config:setListingsLocation",
    async () => await chooseDatabaseLocation()
  );

  ipcMain.handle(
    "config:setDefaultListingsLocation",
    async () => await setDatabaseDefaultLocation()
  );

  ipcMain.handle("config:getDefaults", async () => {
    return getConfig().defaults;
  });

  ipcMain.handle("config:setDefaults", async (_event, defaults: Defaults) => {
    const config = getConfig();
    const result = setConfig({
      ...config,
      defaults: defaults,
    });

    if (typeof result === "string") {
      return result;
    }

    return defaults;
  });

  ipcMain.handle("config:getFileNameDateStart", async () => {
    return getConfig().fileNameDateStart;
  });

  ipcMain.handle(
    "config:setFileNameDateStart",
    async (_event, start: "year" | "day") => {
      const config = getConfig();
      setConfig({
        ...config,
        fileNameDateStart: start,
      });
    }
  );
}
