import { AppConfig } from "config";
import writeFileAtomic from "write-file-atomic";
import { t } from "i18next";
import jsonTypeParse from "../utils/jsonTypeParse";
import fs from "fs";
import { DEFAULT_DB_DIR, CONFIG_FILE_PATH, RECENT } from "./paths";
import { selectDirectory } from "../utils/files";

let cachedConfig: AppConfig;

const saveNewConfig = (): AppConfig => {
  const config: AppConfig = {
    creationTime: new Date(),
    modificationTime: new Date(),
    dbDirectory: DEFAULT_DB_DIR,
    defaults: {},
    fileNameDateStart: "year",
  };

  try {
    writeFileAtomic(CONFIG_FILE_PATH, JSON.stringify(config), "utf8");
    return config;
  } catch (err) {
    console.error(`${t("errors:configCreate")}: ${err}`);
    return config;
  }
};

const getConfig = (): AppConfig => {
  if (cachedConfig) return cachedConfig;

  try {
    fs.accessSync(CONFIG_FILE_PATH);
    const rawData = fs.readFileSync(CONFIG_FILE_PATH, { encoding: "utf8" });
    const data = jsonTypeParse<AppConfig>(rawData);
    cachedConfig = data;
    return data;
  } catch {
    const newConfig = saveNewConfig();
    cachedConfig = newConfig;
    return newConfig;
  }
};

const clearRecents = async () => {
  try {
    await writeFileAtomic(RECENT, "[]");
  } catch (err) {
    console.error(`${t("errors:databaseRecent")}: ${err}`);
  }
};

const setConfig = (config: AppConfig) => {
  const newConfig: AppConfig = {
    ...config,
    modificationTime: new Date(),
  };

  try {
    const rawData = JSON.stringify(newConfig);

    if (config.dbDirectory !== getConfig().dbDirectory) {
      clearRecents();
    }

    writeFileAtomic(CONFIG_FILE_PATH, rawData, "utf8");
    cachedConfig = newConfig;
    return newConfig;
  } catch (err) {
    return `${t("errors:configCreate")}: ${err}`;
  }
};

const chooseDatabaseLocation = async () => {
  const path = await selectDirectory();

  if (!path) return undefined;

  return setConfig({
    ...getConfig(),
    dbDirectory: path,
  });
};

const setDatabaseDefaultLocation = async () => {
  return setConfig({
    ...getConfig(),
    dbDirectory: DEFAULT_DB_DIR,
  });
};

export {
  getConfig,
  setConfig,
  chooseDatabaseLocation,
  setDatabaseDefaultLocation,
};
