"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectSaveLocation = exports.selectFile = exports.selectDirectory = void 0;
const electron_1 = require("electron");
const i18next_1 = require("i18next");
const selectDirectory = async () => {
    const browserWindow = electron_1.BrowserWindow.getFocusedWindow();
    const options = {
        title: (0, i18next_1.t)("strings:Valitse sijainti"),
        properties: ["openDirectory"],
    };
    const { canceled, filePaths } = browserWindow
        ? await electron_1.dialog.showOpenDialog(browserWindow, options)
        : await electron_1.dialog.showOpenDialog(options);
    if (!canceled) {
        return filePaths[0];
    }
};
exports.selectDirectory = selectDirectory;
const selectFile = async (type) => {
    const browserWindow = electron_1.BrowserWindow.getFocusedWindow();
    const options = {
        title: (0, i18next_1.t)("strings:Avaa tuotava juttuluettelo"),
        filters: [
            {
                name: type === "jtl" ? (0, i18next_1.t)("strings:Juttuluettelo") : (0, i18next_1.t)("strings:CSV"),
                extensions: [type],
            },
        ],
        properties: ["openFile"],
    };
    const { canceled, filePaths } = browserWindow
        ? await electron_1.dialog.showOpenDialog(browserWindow, options)
        : await electron_1.dialog.showOpenDialog(options);
    if (!canceled) {
        return filePaths[0];
    }
};
exports.selectFile = selectFile;
const selectSaveLocation = async (filename, filetype) => {
    const browserWindow = electron_1.BrowserWindow.getFocusedWindow();
    const options = {
        title: (0, i18next_1.t)("strings:Valitse vietävän tiedoston sijainti ja nimi"),
        defaultPath: filename,
        filters: [
            filetype
                ? filetype
                : {
                    name: (0, i18next_1.t)("strings:Juttuluettelo"),
                    extensions: ["jtl"],
                },
        ],
        properties: ["showOverwriteConfirmation"],
    };
    const { filePath } = browserWindow
        ? await electron_1.dialog.showSaveDialog(browserWindow, options)
        : await electron_1.dialog.showSaveDialog(options);
    return filePath;
};
exports.selectSaveLocation = selectSaveLocation;
//# sourceMappingURL=files.js.map