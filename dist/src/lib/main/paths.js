"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataDirFilePath = exports.RECENT = exports.LISTINGS_EXT = exports.CONFIG_FILE_PATH = exports.DEFAULT_LISTINGS_DIR = exports.DATADIR = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
exports.DATADIR = electron_1.app.getPath("userData");
exports.DEFAULT_LISTINGS_DIR = path_1.default.join(exports.DATADIR, "listings");
exports.CONFIG_FILE_PATH = path_1.default.join(exports.DATADIR, "config.json");
exports.LISTINGS_EXT = ".jtl";
exports.RECENT = path_1.default.join(exports.DATADIR, "recent.json");
const dataDirFilePath = (filename) => path_1.default.join(exports.DATADIR, filename);
exports.dataDirFilePath = dataDirFilePath;
//# sourceMappingURL=paths.js.map