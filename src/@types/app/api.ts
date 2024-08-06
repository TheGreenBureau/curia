import type { ConfigHandles } from "@configuration";
import type { DatabaseHandles } from "@database/index";
import { Defaults } from "config";
import { Court } from "data/Court";
import {
  Listing,
  ListingCore,
  ListingQueryArgs,
  ListingResult,
} from "data/Listing";
import { CourtOptions, PersonOptions, TitleOptions } from "data/Options";

export interface ConfigResult {
  dbLocation: string;
  isDefault: boolean;
}

type Action<T> = () => Promise<T>;
type ActionWithArg<T, P> = (arg: P) => Promise<T>;

export type ConfigAPI = {
  chooseDatabaseLocation: Action<ConfigResult>;
  setDatabaseDefaultLocation: Action<ConfigResult>;
  getDatabaseLocation: Action<ConfigResult>;
  changeLanguage: ActionWithArg<void, string>;
  getLanguage: Action<string>;
  setDefaults: ActionWithArg<void, Defaults>;
  getDefaults: Action<Defaults>;
  getCourtOptions: ActionWithArg<CourtOptions, string | null>;
  getTitleOptions: Action<TitleOptions>;
  getPersonOptions: Action<PersonOptions>;
  getFilenameDateStart: Action<"year" | "day">;
  setFilenameDateStart: ActionWithArg<"year" | "day", "year" | "day">;
};

export type DatabaseAPI = {
  createDatabase: ActionWithArg<Listing, Listing>;
  openDatabase: ActionWithArg<Listing, string>;
  updateDatabase: ActionWithArg<Listing, Listing>;
  getCurrentDatabase: Action<Listing | null>;
  deselectDatabase: Action<void>;
  deleteDatabase: ActionWithArg<Listing, Listing>;
  importDatabase: Action<Listing>;
  exportDatabase: ActionWithArg<Listing, Listing>;
  getDatabases: ActionWithArg<ListingResult, ListingQueryArgs>;
  refreshDatabases: Action<void>;
  clearRecents: Action<void>;
  getRecents: Action<ListingCore[]>;
  getCourt: ActionWithArg<Court | null, string | null | undefined>;
};

export type ApplicationAPI = ConfigAPI & DatabaseAPI;
