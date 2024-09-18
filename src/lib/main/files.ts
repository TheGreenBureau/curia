import {
  dialog,
  BrowserWindow,
  OpenDialogOptions,
  SaveDialogOptions,
} from "electron";
import { t } from "i18next";

export const selectDirectory = async () => {
  const browserWindow = BrowserWindow.getFocusedWindow();
  const options: OpenDialogOptions = {
    title: t("strings:Valitse sijainti"),
    properties: ["openDirectory"],
  };

  const { canceled, filePaths } = browserWindow
    ? await dialog.showOpenDialog(browserWindow, options)
    : await dialog.showOpenDialog(options);

  if (!canceled) {
    return filePaths[0];
  }
};

export const selectFile = async (type: "jtl" | "csv") => {
  const browserWindow = BrowserWindow.getFocusedWindow();
  const options: OpenDialogOptions = {
    title: t("strings:Avaa tuotava juttuluettelo"),
    filters: [
      {
        name: type === "jtl" ? t("strings:Juttuluettelo") : t("strings:CSV"),
        extensions: [type],
      },
    ],
    properties: ["openFile"],
  };

  const { canceled, filePaths } = browserWindow
    ? await dialog.showOpenDialog(browserWindow, options)
    : await dialog.showOpenDialog(options);

  if (!canceled) {
    return filePaths[0];
  }
};

export const selectSaveLocation = async (
  filename?: string,
  filetype?: { name: string; extensions: string[] }
) => {
  const browserWindow = BrowserWindow.getFocusedWindow();
  const options: SaveDialogOptions = {
    title: t("strings:Valitse vietävän tiedoston sijainti ja nimi"),
    defaultPath: filename,
    filters: [
      filetype
        ? filetype
        : {
            name: t("strings:Juttuluettelo"),
            extensions: ["jtl"],
          },
    ],
    properties: ["showOverwriteConfirmation"],
  };

  const { filePath } = browserWindow
    ? await dialog.showSaveDialog(browserWindow, options)
    : await dialog.showSaveDialog(options);

  return filePath;
};
