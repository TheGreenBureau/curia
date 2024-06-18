import { dialog, BrowserWindow } from "electron";
import { t } from "i18next";

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
