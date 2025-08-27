import type { Defaults } from "./defaults";
import type { Listing } from "@/types/data/listing";
import type { Option } from "@/types/data/options";

export interface ConfigResult {
  listingsLocation: string;
  isDefault: boolean;
}

type Action<T> = () => Promise<T>;
type ActionWithArg<T, P> = (arg: P) => Promise<T>;

export type ConfigAPI = {
  chooseListingsPath: Action<ConfigResult>;
  setDefaultListingsPath: Action<ConfigResult>;
  listingsPath: Action<ConfigResult>;
  setDefaults: ActionWithArg<void, Defaults>;
  defaults: Action<Defaults>;
  saveDataFile: ActionWithArg<void, { data: string; filename: string }>;
  loadDataFile: ActionWithArg<string, { filename: string }>;
  crimes: ActionWithArg<Option[], { lang: string }>;
  crimesSearch: ActionWithArg<Option[], { lang: string; query: string }>;
};

export type ListingsAPI = {
  createListing: ActionWithArg<Listing, Listing>;
  openListing: ActionWithArg<Listing, string>;
  updateListing: ActionWithArg<Listing, Listing>;
  deleteListings: ActionWithArg<
    { deleted: string[]; errors: string[] },
    string[]
  >;
  importListing: Action<Listing>;
  exportListing: ActionWithArg<Listing, Listing>;
  listings: Action<Listing[]>;
  clearRecents: Action<void>;
  recents: Action<Listing[]>;
  openCSV: ActionWithArg<
    { listing: Listing; errors: string[] },
    { currentListing: Listing }
  >;
};

// All the available API calls from window

export type ApplicationAPI = ConfigAPI & ListingsAPI;
