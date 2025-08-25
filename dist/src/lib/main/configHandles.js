"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachConfigHandles = exports.getConfig = void 0;
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
const utils_1 = require("../utils");
const promises_1 = __importDefault(require("fs/promises"));
const paths_1 = require("./paths");
const files_1 = require("@/lib/main/files");
const ipc_1 = require("./ipc");
const immer_1 = require("immer");
const crimes_1 = require("../staticData/crimes");
const uuid_1 = require("uuid");
let cachedConfig;
const createEmptyDefaults = () => {
    return {
        court: "",
        office: "",
        department: "",
        room: "",
        presiding: {
            id: (0, uuid_1.v4)(),
            name: "Mikki Hiiri",
            title: "judge",
            type: "presiding",
        },
        secretary: {
            id: (0, uuid_1.v4)(),
            name: "Hessu Hopo",
            title: "secretary",
            type: "secretary",
        },
        break: null,
        prosecutors: "prosecutor",
    };
};
const saveNewConfig = async () => {
    const config = {
        creationTime: new Date(),
        modificationTime: new Date(),
        listingsDir: paths_1.DEFAULT_LISTINGS_DIR,
        defaults: createEmptyDefaults(),
    };
    try {
        await (0, write_file_atomic_1.default)(paths_1.CONFIG_FILE_PATH, JSON.stringify(config), "utf8");
        return config;
    }
    catch (err) {
        console.error(err);
        return config;
    }
};
const getConfig = async () => {
    if (cachedConfig)
        return cachedConfig;
    try {
        // Check that the file is available before trying to read it
        await promises_1.default.access(paths_1.CONFIG_FILE_PATH);
        const rawData = await promises_1.default.readFile(paths_1.CONFIG_FILE_PATH, { encoding: "utf8" });
        const data = (0, utils_1.jsonTypeParse)(rawData);
        if (!data) {
            throw new Error("Invalid config data");
        }
        cachedConfig = data;
        return data;
    }
    catch (err) {
        const newConfig = await saveNewConfig();
        cachedConfig = newConfig;
        return newConfig;
    }
};
exports.getConfig = getConfig;
const clearRecents = async () => {
    try {
        await (0, write_file_atomic_1.default)(paths_1.RECENT, "[]");
    }
    catch (err) {
        console.error(err);
    }
};
const setConfig = async (config) => {
    const newConfig = (0, immer_1.produce)(config, (draft) => {
        draft.modificationTime = new Date();
    });
    const rawData = JSON.stringify(newConfig);
    const savedConfig = await (0, exports.getConfig)();
    // If the user has changed the directory for listings, recent files do not apply for said directory
    if (config.listingsDir !== savedConfig.listingsDir) {
        clearRecents();
    }
    await (0, write_file_atomic_1.default)(paths_1.CONFIG_FILE_PATH, rawData, "utf8");
    cachedConfig = newConfig;
    return newConfig;
};
const chooseListingsLocation = async (toDefault) => {
    const path = toDefault ? paths_1.DEFAULT_LISTINGS_DIR : await (0, files_1.selectDirectory)();
    if (!path)
        throw new Error("Location choice cancelled.");
    const config = await (0, exports.getConfig)();
    await setConfig((0, immer_1.produce)(config, (draft) => {
        draft.listingsDir = path;
    }));
    return {
        listingsLocation: path,
        isDefault: toDefault,
    };
};
const getDefaults = async () => {
    const { defaults } = await (0, exports.getConfig)();
    return {
        ...defaults,
    };
};
const configHandles = {
    chooseListingsPath: async () => await chooseListingsLocation(false),
    setDefaultListingsPath: async () => await chooseListingsLocation(true),
    listingsPath: async () => {
        const { listingsDir } = await (0, exports.getConfig)();
        return {
            listingsLocation: listingsDir,
            isDefault: listingsDir === paths_1.DEFAULT_LISTINGS_DIR,
        };
    },
    setDefaults: async (defaults) => {
        const config = await (0, exports.getConfig)();
        await setConfig((0, immer_1.produce)(config, (draft) => {
            draft.defaults = defaults;
        }));
    },
    defaults: getDefaults,
    saveDataFile: async ({ data, filename }) => {
        await (0, write_file_atomic_1.default)((0, paths_1.dataDirFilePath)(filename), data, "utf8");
    },
    loadDataFile: async ({ filename }) => {
        return await promises_1.default.readFile((0, paths_1.dataDirFilePath)(filename), { encoding: "utf8" });
    },
    crimes: async ({ lang }) => {
        return (0, crimes_1.getCrimesAsOptions)(lang);
    },
    crimesSearch: async ({ lang, query }) => {
        const crimes = (0, crimes_1.getCrimesAsOptions)(lang);
        if (query === "") {
            return crimes;
        }
        return crimes.filter((crime) => crime.label.toLowerCase().includes(query.toLowerCase()));
    },
};
function attachConfigHandles() {
    (0, ipc_1.attachHandles)(configHandles);
}
exports.attachConfigHandles = attachConfigHandles;
//# sourceMappingURL=configHandles.js.map