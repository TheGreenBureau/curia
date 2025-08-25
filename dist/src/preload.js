"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const createIpc = (key) => {
    return async (...args) => await electron_1.ipcRenderer.invoke(key, ...args);
};
const api = {
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
electron_1.contextBridge.exposeInMainWorld("api", api);
//# sourceMappingURL=preload.js.map