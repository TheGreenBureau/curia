import { contextBridge, ipcRenderer } from "electron";
import { Listing, ListingCore } from "data/Listing";
import { ConfigResult } from "api";
import { Defaults } from "config";

export type DatabaseAPI = {
  createListing: (date: Date, courtId: string) => Promise<string | Listing>;
  openListing: (id: string) => Promise<string | Listing>;
  updateListing: (db: Listing) => Promise<string | Listing>;
  deleteListing: (db: Listing) => Promise<string | Listing>;
  listListings: () => Promise<string | ListingCore[]>;
  listRecent: () => Promise<string | ListingCore[]>;
  importListing: () => Promise<string | ListingCore>;
  exportListing: (db: Listing) => Promise<string | Listing | undefined>;
  getListingsLocation: () => Promise<ConfigResult>;
  setListingsLocation: () => Promise<string | Listing | undefined>;
  setDefaultListingsLocation: () => Promise<string | Listing | undefined>;
  getDefaults: () => Promise<string | Defaults>;
  setDefaults: (defaults: Defaults) => Promise<string | Defaults>;
  getFileNameDateStart: () => Promise<"year" | "day">;
  setFileNameDateStart: (start: "year" | "day") => Promise<void>;
};

const databaseApi: DatabaseAPI = {
  createListing: (date: Date, courtId: string) =>
    ipcRenderer.invoke("db:create", date, courtId),
  openListing: (id: string) => ipcRenderer.invoke("db:open", id),
  updateListing: (db: Listing) => ipcRenderer.invoke("db:update", db),
  deleteListing: (db: Listing) => ipcRenderer.invoke("db:delete", db),
  listListings: () => ipcRenderer.invoke("db:list"),
  listRecent: () => ipcRenderer.invoke("db:recent"),
  importListing: () => ipcRenderer.invoke("db:import"),
  exportListing: (db: Listing) => ipcRenderer.invoke("db:export", db),
  getListingsLocation: () => ipcRenderer.invoke("config:getListingsLocation"),
  setListingsLocation: () => ipcRenderer.invoke("config:setListingsLocation"),
  setDefaultListingsLocation: () =>
    ipcRenderer.invoke("config:setDefaultListingsLocation"),
  getDefaults: () => ipcRenderer.invoke("config:getDefaults"),
  setDefaults: (defaults: Defaults) =>
    ipcRenderer.invoke("config:setDefaults", defaults),
  getFileNameDateStart: () => ipcRenderer.invoke("config:getFileNameDateStart"),
  setFileNameDateStart: (start: "year" | "day") =>
    ipcRenderer.invoke("config:setFileNameDateStart", start),
};

contextBridge.exposeInMainWorld("api", databaseApi);
