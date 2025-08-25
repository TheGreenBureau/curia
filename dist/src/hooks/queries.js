"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCrimesSearch = exports.useCrimes = exports.useListings = exports.useRecents = exports.useListingsPath = exports.useDefaults = exports.useResolvedLanguage = void 0;
const queryKeys_1 = require("@/lib/queryKeys");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useResolvedLanguage = () => {
    const { i18n } = (0, react_i18next_1.useTranslation)();
    return i18n.resolvedLanguage === "sv" ? "sv" : "fi";
};
exports.useResolvedLanguage = useResolvedLanguage;
const useDefaults = () => (0, react_query_1.useQuery)({
    queryKey: [queryKeys_1.QUERY_KEYS.defaults],
    queryFn: window.api.defaults,
});
exports.useDefaults = useDefaults;
const useListingsPath = () => (0, react_query_1.useQuery)({
    queryKey: [queryKeys_1.QUERY_KEYS.listingsPath],
    queryFn: window.api.listingsPath,
});
exports.useListingsPath = useListingsPath;
const useRecents = () => {
    const lang = (0, exports.useResolvedLanguage)();
    return (0, react_query_1.useQuery)({
        queryKey: [queryKeys_1.QUERY_KEYS.recents, lang],
        queryFn: window.api.recents,
    });
};
exports.useRecents = useRecents;
const useListings = () => (0, react_query_1.useQuery)({
    queryKey: [queryKeys_1.QUERY_KEYS.listings],
    queryFn: window.api.listings,
});
exports.useListings = useListings;
const useCrimes = () => {
    const lang = (0, exports.useResolvedLanguage)();
    return (0, react_query_1.useQuery)({
        queryKey: [queryKeys_1.QUERY_KEYS.crimes, lang],
        queryFn: async () => await window.api.crimes({ lang }),
    });
};
exports.useCrimes = useCrimes;
const useCrimesSearch = (query) => {
    const lang = (0, exports.useResolvedLanguage)();
    return (0, react_query_1.useQuery)({
        queryKey: [queryKeys_1.QUERY_KEYS.crimes, lang, query],
        queryFn: async () => await window.api.crimesSearch({ lang, query }),
    });
};
exports.useCrimesSearch = useCrimesSearch;
//# sourceMappingURL=queries.js.map