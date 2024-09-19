import { app } from "electron";
import path from "path";

export const DATADIR = app.getPath("userData");
export const DEFAULT_LISTINGS_DIR = path.join(DATADIR, "listings");
export const CONFIG_FILE_PATH = path.join(DATADIR, "config.json");

export const LISTINGS_EXT = ".jtl";
export const RECENT = path.join(DATADIR, "recent.json");

export const dataDirFilePath = (filename: string) =>
  path.join(DATADIR, filename);
