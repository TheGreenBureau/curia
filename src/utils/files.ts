import { ListingCore } from "data/Listing";
import { dialog, BrowserWindow } from "electron";
import { t } from "i18next";
import { getCourt } from "./courts";
import { format } from "date-fns";
import { getConfig } from "../configuration";

const getOrderedDate = (date: Date, time?: boolean) => {
  const config = getConfig();

  let day =
    config.fileNameDateStart === "year"
      ? format(date, "yyyy-MM-dd")
      : format(date, "dd-MM-yyyy");

  if (time) {
    day = `${day}_${format(date, "HH-mm-ss")}`;
  }

  return day;
};

const courtNotFoundText = (creation: Date) => {
  return `${t("files:filenameNoCourtFound")} ${getOrderedDate(creation, true)}`;
};

export const listingName = (db: ListingCore) => {
  if (!db.courtId) {
    return courtNotFoundText(db.creationDate);
  }

  const court = getCourt(db.id);

  if (!court) {
    return courtNotFoundText(db.creationDate);
  }

  let fileName = `${court.name} ${getOrderedDate(db.date)}`;

  if (db.roomId) {
    const room = court.rooms[db.roomId];

    if (room) {
      fileName = `${fileName} ${room}`;
    }
  }

  return fileName;
};

export const selectDirectory = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    BrowserWindow.getFocusedWindow() || undefined,
    {
      title: t("settings:chooseLocation"),
      properties: ["openDirectory"],
    }
  );

  if (!canceled) {
    return filePaths[0];
  }
};

export const selectFile = async (type: "jtl" | "csv") => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    BrowserWindow.getFocusedWindow() || undefined,
    {
      title: t("welcome:importTitle"),
      filters: [
        {
          name:
            type === "jtl"
              ? t("files:importListingFilename")
              : t("files:importCsvFilename"),
          extensions: [type],
        },
      ],
      properties: ["openFile"],
    }
  );

  if (!canceled) {
    return filePaths[0];
  }
};

export const selectSaveLocation = async (fileName?: string) => {
  const { filePath } = await dialog.showSaveDialog(
    BrowserWindow.getFocusedWindow() || undefined,
    {
      title: t("database:exportTitle"),
      defaultPath: fileName,
      filters: [
        {
          name: t("files:importListingFilename"),
          extensions: ["jtl"],
        },
      ],
      properties: ["showOverwriteConfirmation"],
    }
  );

  return filePath;
};
