"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficerSheet = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const sheet_1 = require("@/components/ui/sheet");
const select_1 = require("@/components/ui/select");
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const persons_1 = require("@/types/data/persons");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/components/ui/button");
const immer_1 = require("immer");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const mutations_1 = require("@/hooks/mutations");
const useStore_1 = require("@/hooks/useStore");
const useResources_1 = require("@/hooks/useResources");
const uuid_1 = require("uuid");
const combocreate_1 = require("@/components/ui/combocreate");
const dataFormat_1 = require("@/lib/dataFormat");
function OfficerSheet({ children, getOfficer, currentCase, }) {
    const [officer, setOfficer] = (0, react_1.useState)(null);
    const [originalName, setOriginalName] = (0, react_1.useState)("");
    const currentListing = (0, useStore_1.useStore)((state) => state.currentListing);
    const updateListing = (0, mutations_1.useMutateCurrentListing)();
    const resources = (0, useResources_1.useResources)();
    const titleOptions = {
        court: (0, dataFormat_1.optionsFromRecord)(resources.data?.courtTitles),
        prosecutor: (0, dataFormat_1.optionsFromRecord)(resources.data?.prosecutorTitles),
        layman: (0, dataFormat_1.optionsFromRecord)(resources.data?.laymanTitles),
    };
    const positionOptions = (0, dataFormat_1.optionsFromRecord)(resources.data?.officerPositions);
    const { t } = (0, react_i18next_1.useTranslation)();
    const updateOfficer = (key, value) => {
        if (!officer) {
            return;
        }
        setOfficer((0, immer_1.produce)(officer, (draft) => {
            draft[key] = value;
        }));
    };
    const isNew = !officer || officer.id === "";
    if (currentListing) {
        const titles = () => {
            if (!officer)
                return [];
            switch (officer.type) {
                case "prosecutor":
                    return titleOptions.prosecutor;
                case "layman":
                    return titleOptions.layman;
                default:
                    return titleOptions.court;
            }
        };
        const descriptionArray = !officer
            ? []
            : [
                ...(currentCase.matter !== ""
                    ? [currentCase.matter.toUpperCase()]
                    : []),
                ...(currentCase.caseNumber !== "" ? [currentCase.caseNumber] : []),
                ...(originalName !== "" ? [originalName] : []),
            ];
        return ((0, jsx_runtime_1.jsxs)(sheet_1.Sheet, { children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTrigger, { onClick: () => {
                        const newOfficer = getOfficer();
                        setOriginalName(newOfficer.name);
                        setOfficer(newOfficer);
                    }, asChild: true, children: children }, void 0), officer && ((0, jsx_runtime_1.jsxs)(sheet_1.SheetContent, { side: "right", className: "sm:max-w-md", children: [(0, jsx_runtime_1.jsxs)(sheet_1.SheetHeader, { children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTitle, { children: isNew ? t("Lisää uusi virkamies") : t("Muokkaa virkamiestä") }, void 0), (0, jsx_runtime_1.jsx)(sheet_1.SheetDescription, { children: descriptionArray.join(" | ") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-4 w-full mt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Asema") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-3", children: (0, jsx_runtime_1.jsxs)(select_1.Select, { value: officer.type, onValueChange: (value) => {
                                                    try {
                                                        const officerType = persons_1.OfficerTypeSchema.parse(value);
                                                        if (officerType !== officer.type) {
                                                            setOfficer({
                                                                ...officer,
                                                                title: "",
                                                                type: officerType,
                                                            });
                                                            return;
                                                        }
                                                        updateOfficer("type", officerType);
                                                    }
                                                    catch (e) {
                                                        console.log(e);
                                                    }
                                                }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-full", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: t("Valitse") }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: (0, jsx_runtime_1.jsx)(select_1.SelectGroup, { children: positionOptions.map((option) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: option.value, children: option.label }, option.value))) }, void 0) }, void 0)] }, void 0) }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "officer-name", className: "text-right", children: t("Nimi") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "officer-name", value: officer.name, className: "col-span-3", onChange: (e) => updateOfficer("name", e.target.value) }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Virkanimike") }, void 0), (0, jsx_runtime_1.jsx)(combocreate_1.ComboCreate, { className: "col-span-3", triggerClassName: "col-span-3", options: titles(), value: officer.title ?? "", onChange: (currentValue) => updateOfficer("title", currentValue) }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(sheet_1.SheetFooter, { className: "mt-6", children: [!isNew && ((0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialog, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "destructive", className: "mr-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "mr-4" }, void 0), t("Poista")] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogContent, { children: [(0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogHeader, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTitle, { children: t("Poista virkamies") }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogDescription, { children: t("Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogFooter, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogCancel, { children: t("Peruuta") }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogAction, { onClick: () => {
                                                                updateListing.mutate((0, immer_1.produce)(currentListing, (draft) => {
                                                                    const foundCaseIndex = draft.cases.findIndex((c) => c.id === currentCase.id);
                                                                    if (foundCaseIndex === -1)
                                                                        return;
                                                                    const index = draft.cases[foundCaseIndex].officers.findIndex((o) => o.id === officer.id);
                                                                    if (index !== -1) {
                                                                        draft.cases[foundCaseIndex].officers =
                                                                            draft.cases[foundCaseIndex].officers.filter((o) => o.id !== officer.id);
                                                                    }
                                                                }));
                                                            }, children: t("Jatka") }, void 0)] }, void 0)] }, void 0)] }, void 0)), (0, jsx_runtime_1.jsx)(sheet_1.SheetClose, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: () => {
                                            updateListing.mutate((0, immer_1.produce)(currentListing, (draft) => {
                                                const foundCaseIndex = draft.cases.findIndex((c) => c.id === currentCase.id);
                                                if (foundCaseIndex === -1)
                                                    return;
                                                if (isNew) {
                                                    draft.cases[foundCaseIndex].officers.push({
                                                        ...officer,
                                                        id: (0, uuid_1.v4)(),
                                                    });
                                                }
                                                const index = draft.cases[foundCaseIndex].officers.findIndex((o) => o.id === officer.id);
                                                if (index !== -1) {
                                                    draft.cases[foundCaseIndex].officers[index] = officer;
                                                }
                                            }));
                                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-4" }, void 0), t("Tallenna")] }, void 0) }, void 0)] }, void 0)] }, void 0))] }, void 0));
    }
}
exports.OfficerSheet = OfficerSheet;
//# sourceMappingURL=OfficerSheet.js.map