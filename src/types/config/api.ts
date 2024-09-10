import type { Defaults } from "./defaults";
import type { Court } from "@/types/data/court";
import type { Listing } from "@/types/data/listing";
import { Case, CaseType } from "@/types/data/case";
import type { Option } from "@/types/data/options";
import { SummonsQueryType } from "@/types/data/persons";

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
  titles: ActionWithArg<
    {
      court: Option[];
      prosecutor: Option[];
      layman: Option[];
    },
    { lang: string }
  >;
  civilians: ActionWithArg<
    { criminal: Option[]; civil: Option[] },
    { lang: string }
  >;
  officers: ActionWithArg<Option[], { lang: string }>;
  summons: ActionWithArg<
    {
      defendant: Option[];
      other: Option[];
    },
    { lang: string }
  >;
  summonsStatuses: ActionWithArg<Option[], { lang: string }>;
  courtSelections: ActionWithArg<
    {
      courts: Option[];
      offices: Option[];
      departments: Option[];
      rooms: Option[];
    },
    {
      courtId: string | undefined | null;
      officeId: string | undefined | null;
      lang: string;
    }
  >;
  courts: ActionWithArg<Court[], { lang: string }>;
  crimes: ActionWithArg<Option[], { lang: string }>;
  crimesSearch: ActionWithArg<Option[], { lang: string; query: string }>;
};

export type ListingsAPI = {
  createListing: ActionWithArg<Listing, Listing>;
  openListing: ActionWithArg<Listing, string>;
  updateListing: ActionWithArg<Listing, Listing>;
  currentListing: Action<Listing | null>;
  deselectCurrentListing: Action<void>;
  deleteListings: ActionWithArg<
    { deleted: string[]; errors: string[] },
    string[]
  >;
  importListing: Action<Listing>;
  exportListing: ActionWithArg<Listing, Listing>;
  listings: Action<Listing[]>;
  clearRecents: Action<void>;
  recents: Action<Listing[]>;
  court: ActionWithArg<Court | null, { courtId: string; lang: string }>;
  openCSV: ActionWithArg<{ errors?: string[] }, { type: CaseType }>;
};

export type ApplicationAPI = ConfigAPI & ListingsAPI;
