"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const alert_1 = require("@/components/ui/alert");
const button_1 = require("@/components/ui/button");
const skeleton_1 = require("@/components/ui/skeleton");
const mutations_1 = require("@/hooks/mutations");
const queries_1 = require("@/hooks/queries");
const lucide_react_1 = require("lucide-react");
const react_i18next_1 = require("react-i18next");
function LocationSelector() {
    const path = (0, queries_1.useListingsPath)();
    const choose = (0, mutations_1.useMutateListingsPath)();
    const setToDefault = (0, mutations_1.useMutateListingsPath)(true);
    const { t } = (0, react_i18next_1.useTranslation)();
    const ShowPath = () => {
        if (path.isPending || path.isFetching) {
            return (0, jsx_runtime_1.jsx)(skeleton_1.Skeleton, { className: "w-full h-8" }, void 0);
        }
        if (path.isError) {
            return ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { variant: "destructive", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertTitle, { children: t("Virhe") }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: t("Juttuluetteloiden sijaintia ei voitu noutaa.") }, void 0)] }, void 0));
        }
        return ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { children: [(0, jsx_runtime_1.jsx)(alert_1.AlertTitle, { className: "uppercase font-dosis", children: path.data
                        ? path.data.isDefault
                            ? t("Oletus")
                            : t("Muokattu")
                        : t("Tuntematon") }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: path.data?.listingsLocation ?? "" }, void 0)] }, void 0));
    };
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-2", children: [(0, jsx_runtime_1.jsx)(ShowPath, {}, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row w-full items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { className: "w-full", onClick: () => choose.mutate(), children: t("Valitse sijainti") }, void 0), (0, jsx_runtime_1.jsx)(button_1.Button, { className: "w-full", onClick: () => setToDefault.mutate(), disabled: path.data?.isDefault ?? true, children: t("Aseta oletussijaintiin") }, void 0)] }, void 0)] }, void 0) }, void 0));
}
exports.LocationSelector = LocationSelector;
//# sourceMappingURL=LocationSelector.js.map