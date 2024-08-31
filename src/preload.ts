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
  civilians: createIpc("civilians"),
  officers: createIpc("officers"),
  summons: createIpc("summons"),
  summonsStatuses: createIpc("summonsStatuses"),
  createListing: createIpc("createListing"),
  openListing: createIpc("openListing"),
  updateListing: createIpc("updateListing"),
  currentListing: createIpc("currentListing"),
  deselectCurrentListing: createIpc("deselectCurrentListing"),
  deleteListings: createIpc("deleteListings"),
  importListing: createIpc("importListing"),
  exportListing: createIpc("exportListing"),
  listings: createIpc("listings"),
  clearRecents: createIpc("clearRecents"),
  recents: createIpc("recents"),
  court: createIpc("court"),
  titles: createIpc("titles"),
  courtSelections: createIpc("courtSelections"),
  courts: createIpc("courts"),
};

contextBridge.exposeInMainWorld("api", api);
