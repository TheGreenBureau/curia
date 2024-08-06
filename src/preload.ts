import { contextBridge, ipcRenderer } from "electron";
import type { ApplicationAPI } from "app/api";

const createIpc = <K extends keyof ApplicationAPI>(key: K) => {
  return async (...args: Parameters<ApplicationAPI[K]>) =>
    await ipcRenderer.invoke(key, ...args);
};

const databaseApi: ApplicationAPI = {
  chooseDatabaseLocation: createIpc("chooseDatabaseLocation"),
  setDatabaseDefaultLocation: createIpc("setDatabaseDefaultLocation"),
  getDatabaseLocation: createIpc("getDatabaseLocation"),
  changeLanguage: createIpc("changeLanguage"),
  getLanguage: createIpc("getLanguage"),
  setDefaults: createIpc("setDefaults"),
  getDefaults: createIpc("getDefaults"),
  getCourtOptions: createIpc("getCourtOptions"),
  getTitleOptions: createIpc("getTitleOptions"),
  getPersonOptions: createIpc("getPersonOptions"),
  getFilenameDateStart: createIpc("getFilenameDateStart"),
  setFilenameDateStart: createIpc("getFilenameDateStart"),
  createDatabase: createIpc("createDatabase"),
  openDatabase: createIpc("openDatabase"),
  updateDatabase: createIpc("updateDatabase"),
  getCurrentDatabase: createIpc("getCurrentDatabase"),
  deselectDatabase: createIpc("deselectDatabase"),
  deleteDatabase: createIpc("deleteDatabase"),
  importDatabase: createIpc("importDatabase"),
  exportDatabase: createIpc("exportDatabase"),
  getDatabases: createIpc("getDatabases"),
  refreshDatabases: createIpc("refreshDatabases"),
  clearRecents: createIpc("clearRecents"),
  getRecents: createIpc("getRecents"),
  getCourt: createIpc("getCourt"),
};

contextBridge.exposeInMainWorld("api", databaseApi);
