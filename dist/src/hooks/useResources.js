"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResources = void 0;
const queries_1 = require("@/hooks/queries");
const react_query_1 = require("@tanstack/react-query");
const fi_json_1 = __importDefault(require("@/locales/resources/fi.json"));
const sv_json_1 = __importDefault(require("@/locales/resources/sv.json"));
const resources_1 = require("@/types/data/resources");
const zod_1 = require("zod");
const getOptions = (lang) => {
    return {
        filename: `resources_${lang}.json`,
        url: `https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/resources/${lang}.json`,
        local: lang === "sv" ? sv_json_1.default : fi_json_1.default,
    };
};
const fetchResources = async (lang) => {
    const options = getOptions(lang);
    let resources = resources_1.ResourcesSchema.parse(options.local);
    try {
        const data = await fetch(options.url);
        resources = resources_1.ResourcesSchema.parse(await data.json());
        await window.api.saveDataFile({
            data: JSON.stringify(resources),
            filename: options.filename,
        });
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            console.log(e.message);
        }
        else {
            console.log(e);
        }
        resources = resources_1.ResourcesSchema.parse(await window.api.loadDataFile({
            filename: options.filename,
        }));
    }
    finally {
        return resources;
    }
};
function useResources() {
    const lang = (0, queries_1.useResolvedLanguage)();
    return (0, react_query_1.useQuery)({
        queryKey: ["resources", lang],
        queryFn: async () => fetchResources(lang),
        staleTime: Infinity,
    });
}
exports.useResources = useResources;
//# sourceMappingURL=useResources.js.map