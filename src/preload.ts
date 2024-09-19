import { ApplicationAPI } from "@/types/config/api";
import { contextBridge, ipcRenderer } from "electron";

const createIpc = <K extends keyof ApplicationAPI>(key: K) => {
  return async (...args: Parameters<ApplicationAPI[K]>) =>
    await ipcRenderer.invoke(key, ...args);
};

const api: ApplicationAPI = {
  chooseListingsPath: createIpc("chooseListingsPath"),
  setDefaultListingsPath: createIpc("setDefaultListingsPath"),
  listingsPath: createIpc("listingsPath"),
  setDefaults: createIpc("setDefaults"),
  defaults: createIpc("defaults"),
  createListing: createIpc("createListing"),
  openListing: createIpc("openListing"),
  updateListing: createIpc("updateListing"),
  deleteListings: createIpc("deleteListings"),
  importListing: createIpc("importListing"),
  exportListing: createIpc("exportListing"),
  listings: createIpc("listings"),
  clearRecents: createIpc("clearRecents"),
  recents: createIpc("recents"),
  openCSV: createIpc("openCSV"),
  crimes: createIpc("crimes"),
  crimesSearch: createIpc("crimesSearch"),
  saveDataFile: createIpc("saveDataFile"),
  loadDataFile: createIpc("loadDataFile"),
};

contextBridge.exposeInMainWorld("api", api);
