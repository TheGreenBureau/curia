"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachHandles = void 0;
const utils_1 = require("../utils");
const electron_1 = require("electron");
const attachHandle = (handles, key) => {
    electron_1.ipcMain.handle(key, async (_event, ...p) => await handles[key].apply(null, p));
};
function attachHandles(handles) {
    const handleKeys = (0, utils_1.stringKeys)(handles);
    handleKeys.forEach((key) => attachHandle(handles, key));
}
exports.attachHandles = attachHandles;
//# sourceMappingURL=ipc.js.map