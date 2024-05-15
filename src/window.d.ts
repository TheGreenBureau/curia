import type { DatabaseAPI } from "./preload";

declare global {
  interface Window {
    api: DatabaseAPI;
  }
}
