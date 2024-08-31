import type { Defaults } from "./defaults";

export interface AppConfig {
  readonly creationTime: Date;
  readonly modificationTime: Date;
  readonly listingsDir: string;
  readonly defaults: Defaults;
}
