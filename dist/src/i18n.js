"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = exports.defaultNS = void 0;
const i18next_1 = __importDefault(require("i18next"));
const react_i18next_1 = require("react-i18next");
const i18next_chained_backend_1 = __importDefault(require("i18next-chained-backend"));
const i18next_resources_to_backend_1 = __importDefault(require("i18next-resources-to-backend"));
const i18next_http_backend_1 = __importDefault(require("i18next-http-backend"));
const fi_json_1 = __importDefault(require("@/locales/strings/fi.json"));
const sv_json_1 = __importDefault(require("@/locales/strings/sv.json"));
exports.defaultNS = "strings";
exports.resources = {
    fi: {
        strings: fi_json_1.default,
    },
    sv: {
        strings: sv_json_1.default,
    },
};
i18next_1.default
    .use(react_i18next_1.initReactI18next)
    .use(i18next_chained_backend_1.default)
    .init({
    debug: true,
    lng: localStorage.getItem("curia-ui-lang") === "sv" ? "sv" : "fi",
    fallbackLng: "fi",
    defaultNS: exports.defaultNS,
    ns: ["strings"],
    backend: {
        backends: [i18next_http_backend_1.default, (0, i18next_resources_to_backend_1.default)(exports.resources)],
        backendOptions: [
            {
                loadPath: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/{{ns}}/{{lng}}.json",
            },
        ],
    },
});
exports.default = i18next_1.default;
//# sourceMappingURL=i18n.js.map