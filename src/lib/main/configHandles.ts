import { AppConfig } from "@/types/config/app";
import writeFileAtomic from "write-file-atomic";
import { jsonTypeParse } from "../utils";
import fs from "fs/promises";
import { DEFAULT_LISTINGS_DIR, CONFIG_FILE_PATH, RECENT } from "./paths";
import { selectDirectory } from "@/lib/main/files";
import { ConfigAPI, ConfigResult } from "@/types/config/api";
import {
  getCourt,
  getCourtDepartments,
  getCourtOffices,
  getOfficeRooms,
  getCourts,
  getCourtsFull,
} from "@/lib/staticData/courts";
import { getTitles } from "@/lib/staticData/titles";
import { getSummons, getSummonsStatuses } from "@/lib/staticData/summons";
import {
  getCivilianPositions,
  getOfficerPositions,
} from "@/lib/staticData/positions";
import { attachHandles } from "./ipc";
import { Defaults } from "@/types/config/defaults";
import { produce } from "immer";
import { getCrimesAsOptions } from "../staticData/crimes";

let cachedConfig: AppConfig;

const createEmptyDefaults = (): Defaults => {
  return {
    court: "",
    office: "",
    department: "",
    room: "",
    presiding: null,
    secretary: null,
    break: null,
  };
};

const saveNewConfig = async (): Promise<AppConfig> => {
  const config: AppConfig = {
    creationTime: new Date(),
    modificationTime: new Date(),
    listingsDir: DEFAULT_LISTINGS_DIR,
    defaults: createEmptyDefaults(),
  };

  try {
    await writeFileAtomic(CONFIG_FILE_PATH, JSON.stringify(config), "utf8");
    return config;
  } catch (err) {
    console.error(err);
    return config;
  }
};

export const getConfig = async (): Promise<AppConfig> => {
  if (cachedConfig) return cachedConfig;

  try {
    // Check that the file is available before trying to read it
    await fs.access(CONFIG_FILE_PATH);

    const rawData = await fs.readFile(CONFIG_FILE_PATH, { encoding: "utf8" });
    const data = jsonTypeParse<AppConfig>(rawData);

    cachedConfig = data;
    return data;
  } catch (err) {
    const newConfig = await saveNewConfig();
    cachedConfig = newConfig;
    return newConfig;
  }
};

const clearRecents = async () => {
  try {
    await writeFileAtomic(RECENT, "[]");
  } catch (err) {
    console.error(err);
  }
};

const setConfig = async (config: AppConfig) => {
  const newConfig = produce(config, (draft) => {
    draft.modificationTime = new Date();
  });
  const rawData = JSON.stringify(newConfig);

  const savedConfig = await getConfig();

  // If the user has changed the directory for listings, recent files do not apply for said directory
  if (config.listingsDir !== savedConfig.listingsDir) {
    clearRecents();
  }

  await writeFileAtomic(CONFIG_FILE_PATH, rawData, "utf8");

  cachedConfig = newConfig;
  return newConfig;
};

const chooseListingsLocation = async (
  toDefault: boolean
): Promise<ConfigResult> => {
  const path = toDefault ? DEFAULT_LISTINGS_DIR : await selectDirectory();

  if (!path) throw new Error("Location choice cancelled.");

  const config = await getConfig();

  await setConfig(
    produce(config, (draft) => {
      draft.listingsDir = path;
    })
  );

  return {
    listingsLocation: path,
    isDefault: toDefault,
  };
};

const getDefaults = async (): Promise<Defaults> => {
  const { defaults } = await getConfig();

  return {
    ...defaults,
  };
};

const configHandles: ConfigAPI = {
  chooseListingsPath: async () => await chooseListingsLocation(false),

  setDefaultListingsPath: async () => await chooseListingsLocation(true),

  listingsPath: async (): Promise<ConfigResult> => {
    const { listingsDir } = await getConfig();

    return {
      listingsLocation: listingsDir,
      isDefault: listingsDir === DEFAULT_LISTINGS_DIR,
    };
  },

  setDefaults: async (defaults: Defaults) => {
    const config = await getConfig();
    await setConfig(
      produce(config, (draft) => {
        draft.defaults = defaults;
      })
    );
  },

  defaults: getDefaults,

  titles: async ({ lang }) => {
    const court = getTitles("court", lang);
    const layman = getTitles("layman", lang);
    const prosecutor = getTitles("prosecutor", lang);

    return {
      court,
      layman,
      prosecutor,
    };
  },

  civilians: async ({ lang }) => {
    const civil = getCivilianPositions(lang, "civil");
    const criminal = getCivilianPositions(lang, "criminal");

    return {
      civil,
      criminal,
    };
  },

  officers: async ({ lang }) => {
    return getOfficerPositions(lang);
  },

  summons: async ({ lang }) => {
    const defendant = getSummons(lang, "defendant");
    const other = getSummons(lang, "other");

    return {
      defendant,
      other,
    };
  },

  summonsStatuses: async ({ lang }) => {
    return getSummonsStatuses(lang);
  },

  courtSelections: async ({ courtId, officeId, lang }) => {
    const courts = getCourts(lang);

    const currentCourt = getCourt(courtId, lang);

    if (!currentCourt) {
      return {
        courts,
        offices: [],
        departments: [],
        rooms: [],
        currentCourt: null,
      };
    }

    const offices = getCourtOffices(currentCourt);
    const departments = getCourtDepartments(currentCourt);

    const currentOffice = currentCourt.offices[officeId];

    if (!currentOffice) {
      return {
        courts,
        offices,
        departments,
        rooms: [],
        currentCourt,
      };
    }

    const rooms = getOfficeRooms(currentOffice);

    return {
      courts,
      offices,
      departments,
      rooms,
      currentCourt,
    };
  },

  courts: async ({ lang }) => {
    return getCourtsFull(lang);
  },

  crimes: async ({ lang }) => {
    return getCrimesAsOptions(lang);
  },

  crimesSearch: async ({ lang, query }) => {
    const crimes = getCrimesAsOptions(lang);

    if (query === "") {
      return crimes;
    }

    return crimes.filter((crime) =>
      crime.label.toLowerCase().includes(query.toLowerCase())
    );
  },
};

export function attachConfigHandles() {
  attachHandles(configHandles);
}
