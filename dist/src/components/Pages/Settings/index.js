"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const mutations_1 = require("@/hooks/mutations");
const queries_1 = require("@/hooks/queries");
const react_i18next_1 = require("react-i18next");
const dialog_1 = require("@/components/ui/dialog");
const button_1 = require("@/components/ui/button");
const CourtSelector_1 = require("@/components/CourtSelector");
const LocationSelector_1 = require("./LocationSelector");
const lucide_react_1 = require("lucide-react");
const headings_1 = require("@/components/ui/headings");
const OfficerSelector_1 = require("@/components/OfficerSelector");
const immer_1 = require("immer");
const separator_1 = require("@/components/ui/separator");
const useStore_1 = require("@/hooks/useStore");
const utils_1 = require("@/lib/utils");
const ProsecutorTitleSelector_1 = require("@/components/Pages/Settings/ProsecutorTitleSelector");
function Settings() {
    const defaults = (0, queries_1.useDefaults)();
    const setDefaults = (0, mutations_1.useMutateDefaults)();
    const showSettings = (0, useStore_1.useStore)((state) => state.showSettings);
    const { t } = (0, react_i18next_1.useTranslation)();
    if (defaults.isSuccess) {
        return ((0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "icon", className: (0, utils_1.cn)("scale-100 transition-all duration-200", !showSettings && "scale-0"), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, {}, void 0) }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-4xl", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { className: "uppercase font-dosis", children: t("Asetukset") }, void 0), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: t("Hallinnoi sovelluksen yleisiä asetuksia") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", children: t("Juttuluetteloiden sijainti") }, void 0), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: t("Tässä voit valita kansiosijainnin, josta juttuluetteloita etsitään ja johon ne tallennetaan.") }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(LocationSelector_1.LocationSelector, {}, void 0), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", children: t("Oletustiedot") }, void 0), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: t("Tähän voit syöttää tiedot, jotka oletusarvoisesti annetaan uusille juttuluetteloille ja jutuille.") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(CourtSelector_1.CourtSelector, { hasTitle: true, values: {
                                        court: defaults.data?.court ?? "",
                                        office: defaults.data?.office ?? "",
                                        department: defaults.data?.department ?? "",
                                        room: defaults.data?.room ?? "",
                                    }, onChange: (values) => {
                                        setDefaults.mutate({
                                            ...defaults.data,
                                            court: values.court,
                                            department: values.department,
                                            office: values.office,
                                            room: values.room,
                                        });
                                    } }, void 0), (0, jsx_runtime_1.jsx)(separator_1.Separator, { orientation: "vertical", className: "ml-6 mr-4" }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-start gap-4 w-full", children: [(0, jsx_runtime_1.jsx)(OfficerSelector_1.OfficerSelector, { values: {
                                                presiding: defaults.data?.presiding ?? null,
                                                secretary: defaults.data?.secretary ?? null,
                                            }, onChange: (values) => {
                                                setDefaults.mutate((0, immer_1.produce)(defaults.data, (draft) => {
                                                    draft.presiding = values.presiding;
                                                    draft.secretary = values.secretary;
                                                }));
                                            } }, void 0), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}, void 0), (0, jsx_runtime_1.jsx)(ProsecutorTitleSelector_1.ProsecutorTitleSelector, { value: defaults.data.prosecutors, onChange: (value) => setDefaults.mutate((0, immer_1.produce)(defaults.data, (draft) => {
                                                draft.prosecutors = value;
                                            })) }, void 0)] }, void 0)] }, void 0)] }, void 0)] }, void 0));
    }
}
exports.Settings = Settings;
//# sourceMappingURL=index.js.map