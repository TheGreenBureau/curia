import type { ApplicationAPI } from "app/api";

declare global {
  interface Window {
    api: ApplicationAPI;
  }
}
