import tabs from "../locales/fi/tabs.json";
import welcome from "../locales/fi/welcome.json";
import errors from "../locales/fi/errors.json";
import files from "../locales/fi/files.json";
import database from "../locales/fi/database.json";
import settings from "../locales/fi/settings.json";
import courtTitles from "../locales/fi/courtTitles.json";
import prosecutorTitles from "../locales/fi/prosecutorTitles.json";
import peoplePositions from "../locales/fi/peoplePositions.json";
import defendantSummonsType from "../locales/fi/defendantSummonsTypes.json";
import genericSummonsTypes from "../locales/fi/genericSummonsTypes.json";
import summonsStatus from "../locales/fi/summonsStatus.json";

const resources = {
  tabs,
  welcome,
  errors,
  files,
  database,
  settings,
  courtTitles,
  prosecutorTitles,
  peoplePositions,
  defendantSummonsType,
  genericSummonsTypes,
  summonsStatus,
} as const;

export default resources;
