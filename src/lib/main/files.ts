import { dialog, BrowserWindow } from "electron";
import { t } from "i18next";

export const selectDirectory = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    BrowserWindow.getFocusedWindow() || undefined,
    {
      title: t("strings:Valitse sijainti"),
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
      title: t("strings:Avaa tuotava juttuluettelo"),
      filters: [
        {
          name: type === "jtl" ? t("strings:Juttuluettelo") : t("strings:CSV"),
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

export const selectSaveLocation = async (filename?: string) => {
  const { filePath } = await dialog.showSaveDialog(
    BrowserWindow.getFocusedWindow() || undefined,
    {
      title: t("strings:Valitse vietävän tiedoston sijainti ja nimi"),
      defaultPath: filename,
      filters: [
        {
          name: t("strings:Juttuluettelo"),
          extensions: ["jtl"],
        },
      ],
      properties: ["showOverwriteConfirmation"],
    }
  );

  return filePath;
};
