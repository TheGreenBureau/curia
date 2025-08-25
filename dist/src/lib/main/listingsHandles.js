"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachListingsHandles = exports.clearRecents = exports.createListingsDir = void 0;
const listing_1 = require("@/types/data/listing");
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
const paths_1 = require("./paths");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const files_1 = require("./files");
const ipc_1 = require("./ipc");
const configHandles_1 = require("./configHandles");
const immer_1 = require("immer");
const csv_1 = require("../csv");
const listingPath = async (id) => {
    const { listingsDir } = await (0, configHandles_1.getConfig)();
    return path_1.default.join(listingsDir, `${id}${paths_1.LISTINGS_EXT}`);
};
const getAllListingFiles = async () => {
    const { listingsDir } = await (0, configHandles_1.getConfig)();
    const allFiles = await promises_1.default.readdir(listingsDir);
    const files = allFiles.filter((f) => path_1.default.extname(f).toLowerCase() === paths_1.LISTINGS_EXT);
    return files;
};
const createListingsDir = async () => {
    const { listingsDir } = await (0, configHandles_1.getConfig)();
    await promises_1.default.mkdir(listingsDir, { recursive: true });
};
exports.createListingsDir = createListingsDir;
const writeToFile = async (listing) => {
    const content = JSON.stringify(listing);
    await (0, write_file_atomic_1.default)(await listingPath(listing.id), content, "utf8");
    return listing;
};
const readFromFile = async (id) => {
    const fileContent = await promises_1.default.readFile(await listingPath(id), {
        encoding: "utf8",
    });
    const data = JSON.parse(fileContent);
    return listing_1.ListingSchema.parse(data);
};
const deleteFile = async (listingId) => {
    await promises_1.default.rm(await listingPath(listingId));
    return listingId;
};
const listRecent = async () => {
    try {
        const recentRaw = await promises_1.default.readFile(paths_1.RECENT, { encoding: "utf8" });
        const data = JSON.parse(recentRaw);
        return listing_1.ListingSchema.array().parse(data);
    }
    catch (err) {
        console.error(err);
        await (0, write_file_atomic_1.default)(paths_1.RECENT, "[]");
        return [];
    }
};
const addToRecents = async (listing) => {
    try {
        const recent = await listRecent();
        let filtered = recent.filter((r) => r.id !== listing.id);
        filtered.unshift(listing);
        if (filtered.length > 5) {
            filtered = filtered.slice(0, 5);
        }
        await (0, write_file_atomic_1.default)(paths_1.RECENT, JSON.stringify(filtered));
    }
    catch (err) {
        console.error(err);
        throw err;
    }
};
const removeFromRecents = async (listing) => {
    const recent = await listRecent();
    const filtered = recent.filter((r) => r.id !== (typeof listing === "string" ? listing : listing.id));
    await (0, write_file_atomic_1.default)(paths_1.RECENT, JSON.stringify(filtered));
};
const clearRecents = async () => {
    await (0, write_file_atomic_1.default)(paths_1.RECENT, "[]");
};
exports.clearRecents = clearRecents;
const filesAsListings = async (files) => {
    const listings = [];
    for (let file of files) {
        try {
            const { listingsDir } = await (0, configHandles_1.getConfig)();
            const content = await promises_1.default.readFile(path_1.default.join(listingsDir, file), {
                encoding: "utf8",
            });
            const data = JSON.parse(content);
            listings.push(listing_1.ListingSchema.parse(data));
        }
        catch {
            continue;
        }
    }
    return listings;
};
const importCSV = async () => {
    const filePath = await (0, files_1.selectFile)("csv");
    if (!filePath)
        throw new Error("Import cancelled.");
    if (path_1.default.extname(filePath).toLowerCase() !== ".csv") {
        throw new Error("Wrong file type.");
    }
    const data = await promises_1.default.readFile(filePath, { encoding: "utf8" });
    return data;
};
const importListing = async () => {
    const filePath = await (0, files_1.selectFile)("jtl");
    if (!filePath)
        throw new Error("Import cancelled");
    if (path_1.default.extname(filePath) !== paths_1.LISTINGS_EXT) {
        throw new Error("Wrong file type");
    }
    const rawData = await promises_1.default.readFile(filePath, { encoding: "utf8" });
    const dataUntyped = JSON.parse(rawData);
    const data = listing_1.ListingSchema.parse(dataUntyped);
    await writeToFile(data);
    try {
        await addToRecents(data);
    }
    finally {
        return data;
    }
};
const listingsHandles = {
    createListing: async (listing) => {
        await writeToFile(listing);
        try {
            await addToRecents(listing);
        }
        finally {
            return listing;
        }
    },
    openListing: async (id) => {
        let result = await readFromFile(id);
        try {
            await addToRecents(result);
        }
        finally {
            return result;
        }
    },
    updateListing: async (listing) => {
        await writeToFile(listing);
        return listing;
    },
    deleteListings: async (listings) => {
        const deleted = [];
        const errors = [];
        for (const listingId of listings) {
            try {
                await deleteFile(listingId);
                deleted.push(listingId);
            }
            catch {
                errors.push(listingId);
                continue;
            }
            finally {
                try {
                    await removeFromRecents(listingId);
                }
                catch {
                    continue;
                }
            }
        }
        return { deleted, errors };
    },
    importListing: importListing,
    exportListing: async (listing) => {
        const filePath = await (0, files_1.selectSaveLocation)(`${listing.id}${paths_1.LISTINGS_EXT}`);
        if (!filePath)
            throw new Error("Export cancelled");
        const rawData = JSON.stringify(listing);
        await (0, write_file_atomic_1.default)(filePath, rawData, "utf8");
        return listing;
    },
    listings: async () => {
        const files = await getAllListingFiles();
        return await filesAsListings(files);
    },
    clearRecents: exports.clearRecents,
    recents: listRecent,
    openCSV: async ({ type, currentListing }) => {
        const { defaults } = await (0, configHandles_1.getConfig)();
        const csv = await importCSV();
        const parseResult = (0, csv_1.parseCSV)(csv, type, defaults, currentListing);
        const updatedListing = (0, immer_1.produce)(currentListing, (draft) => {
            draft.cases = parseResult.cases;
        });
        await writeToFile(updatedListing);
        return { listing: updatedListing, errors: parseResult.errors };
    },
};
function attachListingsHandles() {
    (0, ipc_1.attachHandles)(listingsHandles);
}
exports.attachListingsHandles = attachListingsHandles;
//# sourceMappingURL=listingsHandles.js.map