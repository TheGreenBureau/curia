"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCase = exports.useCases = void 0;
const mutations_1 = require("@/hooks/mutations");
const react_1 = require("react");
const immer_1 = require("immer");
const useStore_1 = require("@/hooks/useStore");
const useCases = () => {
    const [cases, setCases] = (0, react_1.useState)([]);
    const listing = (0, useStore_1.useStore)((state) => state.currentListing);
    (0, react_1.useEffect)(() => {
        setCases(listing ? listing.cases : []);
    }, [listing]);
    const updateListing = (0, mutations_1.useMutateCurrentListing)();
    const updateCases = (cases) => {
        if (!listing) {
            return;
        }
        setCases(cases);
        updateListing.mutate((0, immer_1.produce)(listing, (draft) => {
            draft.cases = cases;
        }));
    };
    return [cases, updateCases, listing];
};
exports.useCases = useCases;
const useCase = (item) => {
    const [currentCase, setCurrentCase] = (0, react_1.useState)({
        ...item,
        time: new Date(item.time),
    });
    const currentListing = (0, useStore_1.useStore)((state) => state.currentListing);
    const updateListing = (0, mutations_1.useMutateCurrentListing)();
    (0, react_1.useEffect)(() => {
        if (currentListing) {
            const foundCase = currentListing.cases.find((c) => c.id === currentCase.id);
            if (foundCase) {
                setCurrentCase({
                    ...foundCase,
                    time: new Date(foundCase.time),
                });
            }
        }
    }, [currentListing]);
    const updateCase = (updated) => {
        setCurrentCase(updated);
    };
    const saveCase = (updated) => {
        if (updated) {
            setCurrentCase(updated);
        }
        if (!currentListing) {
            return;
        }
        updateListing.mutate((0, immer_1.produce)(currentListing, (draft) => {
            const currentCaseIndex = draft.cases.findIndex((c) => c.id === item.id);
            if (currentCaseIndex === -1) {
                draft.cases.push(updated ?? currentCase);
            }
            draft.cases[currentCaseIndex] = updated ?? currentCase;
        }));
    };
    return {
        currentCase,
        updateCase,
        saveCase,
        currentListing,
    };
};
exports.useCase = useCase;
//# sourceMappingURL=useCases.js.map