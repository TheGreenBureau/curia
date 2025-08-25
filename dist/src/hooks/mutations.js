"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMutateOpenCSV = exports.useMutateImportListing = exports.useMutateDeleteListings = exports.useMutateCreateListing = exports.useMutateOpenListing = exports.useMutateDefaults = exports.useMutateListingsPath = exports.useMutateCurrentListing = void 0;
const queryKeys_1 = require("@/lib/queryKeys");
const react_query_1 = require("@tanstack/react-query");
const useStore_1 = require("@/hooks/useStore");
const useMutateCurrentListing = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const setCurrentListing = (0, useStore_1.useStore)((state) => state.setCurrentListing);
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            setCurrentListing(data);
            await window.api.updateListing(data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.recents],
            });
        },
    });
};
exports.useMutateCurrentListing = useMutateCurrentListing;
const useMutateListingsPath = (toDefault) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: toDefault
            ? window.api.setDefaultListingsPath
            : window.api.chooseListingsPath,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.listingsPath],
            });
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.listings],
            });
        },
    });
};
exports.useMutateListingsPath = useMutateListingsPath;
const useMutateDefaults = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: window.api.setDefaults,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.defaults],
            });
        },
    });
};
exports.useMutateDefaults = useMutateDefaults;
const useMutateOpenListing = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const setCurrentListing = (0, useStore_1.useStore)((state) => state.setCurrentListing);
    return (0, react_query_1.useMutation)({
        mutationFn: window.api.openListing,
        onSuccess: async (data) => {
            setCurrentListing(data);
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.recents],
            });
        },
    });
};
exports.useMutateOpenListing = useMutateOpenListing;
const useMutateCreateListing = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const setCurrentListing = (0, useStore_1.useStore)((state) => state.setCurrentListing);
    return (0, react_query_1.useMutation)({
        mutationFn: window.api.createListing,
        onSuccess: async (data) => {
            setCurrentListing(data);
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.recents],
            });
        },
    });
};
exports.useMutateCreateListing = useMutateCreateListing;
const useMutateDeleteListings = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: window.api.deleteListings,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.listings],
            });
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.recents],
            });
        },
    });
};
exports.useMutateDeleteListings = useMutateDeleteListings;
const useMutateImportListing = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const setCurrentListing = (0, useStore_1.useStore)((state) => state.setCurrentListing);
    return (0, react_query_1.useMutation)({
        mutationFn: window.api.importListing,
        onSuccess: async (data) => {
            setCurrentListing(data);
            await queryClient.invalidateQueries({
                queryKey: [queryKeys_1.QUERY_KEYS.recents],
            });
        },
    });
};
exports.useMutateImportListing = useMutateImportListing;
const useMutateOpenCSV = () => {
    const setCurrentListing = (0, useStore_1.useStore)((state) => state.setCurrentListing);
    return (0, react_query_1.useMutation)({
        mutationFn: window.api.openCSV,
        onSuccess: async (data) => {
            setCurrentListing(data.listing);
        },
    });
};
exports.useMutateOpenCSV = useMutateOpenCSV;
//# sourceMappingURL=mutations.js.map