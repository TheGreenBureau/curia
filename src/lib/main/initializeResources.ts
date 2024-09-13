import fiCourtsLocal from "@/locales/fi/courts.json";
import svCourtsLocal from "@/locales/sv/courts.json";
import fiCourtTitlesLocal from "@/locales/fi/courtTitles.json";
import svCourtTitlesLocal from "@/locales/sv/courtTitles.json";
import fiProsecutorTitlesLocal from "@/locales/fi/prosecutorTitles.json";
import svProsecutorTitlesLocal from "@/locales/sv/prosecutorTitles.json";
import fiLaymanTitlesLocal from "@/locales/fi/laymanTitles.json";
import svLaymanTitlesLocal from "@/locales/sv/laymanTitles.json";
import { dataDirFilePath } from "@/lib/main/paths";
import writeFileAtomic from "write-file-atomic";
import fetch from "node-fetch";

const COURTS_URL_FI =
  "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/courts/fi/courts.json";
const COURTS_URL_SV =
  "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/courts/sv/courts.json";
const COURT_TITLES_URL_FI =
  "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/fi/courtTitles.json";
const COURT_TITLES_URL_SV =
  "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/sv/courtTitles.json";
const PROSECUTOR_TITLES_URL_FI =
  "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/fi/prosecutorTitles.json";
const PROSECUTOR_TITLES_URL_SV =
  "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/sv/prosecutorTitles.json";
const LAYMAN_TITLES_URL_FI =
  "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/fi/laymanTitles.json";
const LAYMAN_TITLES_URL_SV =
  "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/sv/laymanTitles.json";

export const initializeResources = async () => {};
