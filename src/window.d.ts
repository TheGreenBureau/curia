import type { ApplicationAPI } from "@/types/config/api";

declare global {
  interface Window {
    api: ApplicationAPI;
  }
}
