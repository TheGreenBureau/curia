"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrimesAsOptions = void 0;
const crimes_json_1 = __importDefault(require("@/locales/crimes/crimes.json"));
const getCrimesAsOptions = (lang) => {
    const language = lang === "fi" || lang === "sv" ? lang : "fi";
    const crimes = crimes_json_1.default
        .filter((c) => c.type === undefined)
        .map((crime) => {
        return {
            value: crime.fi,
            label: crime[language],
        };
    });
    return crimes;
};
exports.getCrimesAsOptions = getCrimesAsOptions;
//# sourceMappingURL=crimes.js.map