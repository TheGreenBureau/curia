import { AppConfig } from "config";
import writeFileAtomic from "write-file-atomic";
import { jsonTypeParse } from "@common/dataUtils";
import fs from "fs/promises";
import { DEFAULT_DB_DIR, CONFIG_FILE_PATH, RECENT } from "./paths";
import { selectDirectory } from "@common/files/query";
import { Defaults } from "config";
import { ConfigAPI, ConfigResult } from "app/api";
import {
  getCourt,
  getCourtDetail,
  getCourtDetailAsOptions,
  getCourtsAsOptions,
} from "@common/courts/query";
import { Officer } from "data/Persons";
import {
  getTitleOption,
  getTitlesAsOptions,
  isDefaultTitle,
} from "@common/titles/query";
import { CourtOptions, PersonOptions, TitleOptions } from "data/Options";
import { getSummonsAsOptions } from "@common/summons/query";
import { getPositionsAsOptions } from "@common/positions/query";
import { attachHandles } from "../ipc";

let cachedConfig: AppConfig;

const createEmptyDefaults = (): Defaults => {
  return {
    court: null,
    office: null,
    department: null,
    room: null,
    presiding: null,
    secretary: null,
    break: null,
  };
};

const saveNewConfig = async (): Promise<AppConfig> => {
  const config: AppConfig = {
    creationTime: new Date(),
    modificationTime: new Date(),
    dbDirectory: DEFAULT_DB_DIR,
    defaults: createEmptyDefaults(),
    fileNameDateStart: "year",
    language: Intl.DateTimeFormat().resolvedOptions().locale,
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
    await fs.access(CONFIG_FILE_PATH);
    const rawData = await fs.readFile(CONFIG_FILE_PATH, { encoding: "utf8" });
    const data = jsonTypeParse<AppConfig>(rawData);
    cachedConfig = data;
    return data;
  } catch {
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
  const newConfig: AppConfig = {
    ...config,
    modificationTime: new Date(),
  };

  const rawData = JSON.stringify(newConfig);
  const savedConfig = await getConfig();

  if (config.dbDirectory !== savedConfig.dbDirectory) {
    clearRecents();
  }

  await writeFileAtomic(CONFIG_FILE_PATH, rawData, "utf8");
  cachedConfig = newConfig;
  return newConfig;
};

const databaseLocationChoose = async (
  toDefault: boolean
): Promise<ConfigResult> => {
  const path = toDefault ? DEFAULT_DB_DIR : await selectDirectory();
  if (!path) throw new Error("Location choice cancelled");

  const config = await getConfig();

  await setConfig({
    ...config,
    dbDirectory: path,
  });

  return {
    dbLocation: path,
    isDefault: toDefault,
  };
};

const configHandles: ConfigAPI = {
  chooseDatabaseLocation: async () => await databaseLocationChoose(false),
  setDatabaseDefaultLocation: async () => await databaseLocationChoose(true),
  getDatabaseLocation: async (): Promise<ConfigResult> => {
    const { dbDirectory } = await getConfig();

    return {
      dbLocation: dbDirectory,
      isDefault: dbDirectory === DEFAULT_DB_DIR,
    };
  },
  changeLanguage: async (lang: string) => {
    const config = await getConfig();
    await setConfig({
      ...config,
      language: lang,
    });
  },
  getLanguage: async (): Promise<string> => {
    const { language } = await getConfig();
    return language;
  },
  setDefaults: async (defaults: Defaults) => {
    const config = await getConfig();
    await setConfig({
      ...config,
      defaults: defaults,
    });
  },
  getDefaults: async (): Promise<Defaults> => {
    const { defaults, language: lang } = await getConfig();

    const court = defaults.court ? getCourt(defaults.court?.id, lang) : null;
    const office =
      court && defaults.office
        ? getCourtDetail(court.id, defaults.office.id, "offices", lang)
        : null;
    const department =
      court && defaults.department
        ? getCourtDetail(court.id, defaults.department.id, "departments", lang)
        : null;
    const room =
      court && defaults.room
        ? getCourtDetail(court.id, defaults.room.id, "rooms", lang)
        : null;

    const presiding: Officer | null = defaults.presiding
      ? { ...defaults.presiding }
      : null;

    if (
      defaults.presiding?.title &&
      isDefaultTitle("court", defaults.presiding.title.id)
    ) {
      presiding.title = getTitleOption(
        "court",
        lang,
        defaults.presiding.title.id
      );
    }

    const secretary: Officer | null = defaults.secretary
      ? { ...defaults.secretary }
      : null;

    if (
      defaults.secretary?.title &&
      isDefaultTitle("court", defaults.secretary.title.id)
    ) {
      secretary.title = getTitleOption(
        "court",
        lang,
        defaults.secretary.title.id
      );
    }

    return {
      court: court ? { id: court.id, content: court.name } : null,
      office: office ? { id: defaults.office.id, content: office } : null,
      department: department
        ? { id: defaults.department.id, content: department }
        : null,
      room: room ? { id: defaults.room.id, content: room } : null,
      presiding: presiding,
      secretary: secretary,
      break: defaults.break,
    };
  },
  getCourtOptions: async (courtId: string | null): Promise<CourtOptions> => {
    const { language } = await getConfig();

    const courtsOnly: CourtOptions = {
      courts: getCourtsAsOptions(language),
      offices: [],
      departments: [],
      rooms: [],
    };

    if (!courtId) {
      return courtsOnly;
    }

    const court = getCourt(courtId, language);

    if (!court) {
      return courtsOnly;
    }

    return {
      ...courtsOnly,
      offices: getCourtDetailAsOptions("offices", court),
      departments: getCourtDetailAsOptions("departments", court),
      rooms: getCourtDetailAsOptions("rooms", court),
    };
  },
  getTitleOptions: async (): Promise<TitleOptions> => {
    const { language } = await getConfig();

    return {
      courtTitles: getTitlesAsOptions("court", language),
      prosecutorTitles: getTitlesAsOptions("prosecutor", language),
    };
  },
  getPersonOptions: async (): Promise<PersonOptions> => {
    const { language } = await getConfig();

    return {
      defendantSummons: getSummonsAsOptions("defendant", language),
      genericSummons: getSummonsAsOptions("generic", language),
      summonsStatuses: getSummonsAsOptions("status", language),
      positions: getPositionsAsOptions(language),
    };
  },
  getFilenameDateStart: async (): Promise<"year" | "day"> => {
    const { fileNameDateStart } = await getConfig();
    return fileNameDateStart;
  },
  setFilenameDateStart: async (
    start: "year" | "day"
  ): Promise<"year" | "day"> => {
    const config = await getConfig();
    await setConfig({
      ...config,
      fileNameDateStart: start,
    });
    return start;
  },
};

export type ConfigHandles = typeof configHandles;

export const configHandlesKeys = Object.keys(configHandles);

export function attachConfigHandles() {
  attachHandles(configHandles);
}
