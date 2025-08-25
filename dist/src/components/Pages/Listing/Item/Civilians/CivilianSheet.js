"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CivilianSheet = void 0;
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
const checkbox_1 = require("@/components/ui/checkbox");
const combocreate_1 = require("@/components/ui/combocreate");
const dataFormat_1 = require("@/lib/dataFormat");
const queries_1 = require("@/hooks/queries");
function CivilianSheet({ children, getCivilian, currentCase, }) {
    const [civilian, setCivilian] = (0, react_1.useState)(null);
    const [originalName, setOriginalName] = (0, react_1.useState)("");
    const currentListing = (0, useStore_1.useStore)((state) => state.currentListing);
    if (currentListing) {
        const isNew = !civilian || civilian.id === "";
        return ((0, jsx_runtime_1.jsxs)(sheet_1.Sheet, { children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTrigger, { asChild: true, onClick: () => {
                        const newCivilian = getCivilian();
                        setOriginalName(newCivilian.name);
                        setCivilian(newCivilian);
                    }, children: children }, void 0), civilian && ((0, jsx_runtime_1.jsx)(CivilianSheetContent, { currentCase: currentCase, civilian: civilian, isNew: isNew, originalName: originalName, setCivilian: setCivilian, currentListing: currentListing }, void 0))] }, void 0));
    }
}
exports.CivilianSheet = CivilianSheet;
function CivilianSheetContent({ currentCase, civilian, isNew, originalName, setCivilian, currentListing, }) {
    const updateListing = (0, mutations_1.useMutateCurrentListing)();
    const resources = (0, useResources_1.useResources)();
    const crimes = (0, queries_1.useCrimes)();
    const summonOptions = {
        summons: (0, dataFormat_1.optionsFromRecord)(resources.data?.summons),
        summonsStatus: (0, dataFormat_1.optionsFromRecord)(resources.data?.summonsStatus),
    };
    let positionOptions = (0, dataFormat_1.optionsFromRecord)(resources.data?.civilianPositions);
    if (currentCase.type === "criminal") {
        positionOptions = positionOptions.filter((o) => o.value !== "plaintiff");
    }
    const { t } = (0, react_i18next_1.useTranslation)();
    const updateCivilian = (key, value) => {
        setCivilian((0, immer_1.produce)(civilian, (draft) => {
            draft[key] = value;
        }));
    };
    const onTypeChange = (value) => {
        if (value !== civilian.type &&
            (value === "defendant" || civilian.type === "defendant")) {
            setCivilian({
                ...civilian,
                summonsType: undefined,
                type: value,
            });
            return;
        }
        updateCivilian("type", value);
    };
    const onDelete = () => {
        updateListing.mutate((0, immer_1.produce)(currentListing, (draft) => {
            const foundCaseIndex = draft.cases.findIndex((c) => c.id === currentCase.id);
            if (foundCaseIndex === -1)
                return;
            const index = draft.cases[foundCaseIndex].civilians.findIndex((c) => c.id === civilian.id);
            if (index !== -1) {
                draft.cases[foundCaseIndex].civilians = draft.cases[foundCaseIndex].civilians.filter((c) => c.id !== civilian.id);
            }
        }));
    };
    const onSave = () => {
        updateListing.mutate((0, immer_1.produce)(currentListing, (draft) => {
            const foundCaseIndex = draft.cases.findIndex((c) => c.id === currentCase.id);
            if (foundCaseIndex === -1)
                return;
            if (isNew) {
                draft.cases[foundCaseIndex].civilians.push({
                    ...civilian,
                    id: (0, uuid_1.v4)(),
                });
            }
            const index = draft.cases[foundCaseIndex].civilians.findIndex((c) => c.id === civilian.id);
            if (index !== -1) {
                draft.cases[foundCaseIndex].civilians[index] = civilian;
            }
        }));
    };
    const summons = () => {
        switch (civilian.type) {
            case "defendant":
                return summonOptions.summons.filter((s) => {
                    try {
                        persons_1.DefendantSummonsSchema.parse(s.value);
                        return true;
                    }
                    catch {
                        return false;
                    }
                });
            default:
                return summonOptions.summons.filter((s) => {
                    try {
                        persons_1.OtherSummonsSchema.parse(s.value);
                        return true;
                    }
                    catch {
                        return false;
                    }
                });
        }
    };
    const matter = crimes.isSuccess
        ? crimes.data.find((crime) => crime.value === currentCase.matter)?.label ??
            ""
        : "";
    const descriptionArray = !civilian
        ? []
        : [
            ...(currentCase.matter !== "" ? [matter] : []),
            ...(currentCase.caseNumber !== "" ? [currentCase.caseNumber] : []),
            ...(originalName !== "" ? [originalName] : []),
        ];
    return ((0, jsx_runtime_1.jsxs)(sheet_1.SheetContent, { side: "right", className: "sm:max-w-lg", children: [(0, jsx_runtime_1.jsxs)(sheet_1.SheetHeader, { children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTitle, { children: isNew ? t("Lisää uusi siviili") : t("Muokkaa siviiliä") }, void 0), (0, jsx_runtime_1.jsx)(sheet_1.SheetDescription, { children: descriptionArray.join(" | ") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-4 w-full mt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Asema") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-3", children: (0, jsx_runtime_1.jsxs)(select_1.Select, { value: civilian.type, onValueChange: onTypeChange, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-full", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: t("Valitse") }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: (0, jsx_runtime_1.jsx)(select_1.SelectGroup, { children: positionOptions.map((o) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: o.value, children: o.label }, o.value))) }, void 0) }, void 0)] }, void 0) }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "civilian-name", className: "text-right", children: t("Nimi") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "civilian-name", value: civilian.name, className: "col-span-3", onChange: (e) => updateCivilian("name", e.target.value) }, void 0)] }, void 0), (civilian.type === "defendant" ||
                        civilian.type === "injured" ||
                        civilian.type === "plaintiff") && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "civilian-counselor", className: "text-right", children: t("Avustaja") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "civilian-counselor", value: civilian.counselor ?? "", className: "col-span-3", onChange: (e) => updateCivilian("counselor", e.target.value) }, void 0)] }, void 0)), (civilian.type === "plaintiff" || civilian.type === "injured") && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "civilian-representative", className: "text-right", children: t("Edustaja") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "civilian-representative", value: civilian.representative ?? "", className: "col-span-3", onChange: (e) => updateCivilian("representative", e.target.value) }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "civilian-trustee", className: "text-right", children: t("Edunvalvoja") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "civilian-trustee", value: civilian.trustee ?? "", className: "col-span-3", onChange: (e) => updateCivilian("trustee", e.target.value) }, void 0)] }, void 0)] }, void 0)), civilian.type === "injured" && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "civilian-demands", className: "text-right", children: t("Korvausvaatimus") }, void 0), (0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "civilian-demands", className: "h-6 w-6", checked: civilian.hasDemands ?? false, onCheckedChange: (checked) => {
                                    if (checked === "indeterminate") {
                                        return;
                                    }
                                    updateCivilian("hasDemands", checked);
                                } }, void 0)] }, void 0)), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Kutsu") }, void 0), (0, jsx_runtime_1.jsx)(combocreate_1.ComboCreate, { className: "col-span-3", triggerClassName: "col-span-3", options: summons(), value: civilian.summonsType ?? "", onChange: (value) => {
                                    updateCivilian("summonsType", value);
                                } }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Haastamistilanne") }, void 0), (0, jsx_runtime_1.jsx)(combocreate_1.ComboCreate, { className: "col-span-3", triggerClassName: "col-span-3", options: summonOptions.summonsStatus, value: civilian.summonsStatus ?? "", onChange: (value) => {
                                    updateCivilian("summonsStatus", value);
                                } }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(sheet_1.SheetFooter, { className: "mt-6", children: [!isNew && ((0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialog, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "destructive", className: "mr-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "mr-4" }, void 0), t("Poista")] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogContent, { children: [(0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogHeader, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTitle, { children: t("Poista siviili") }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogDescription, { children: t("Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogFooter, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogCancel, { children: t("Peruuta") }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogAction, { onClick: onDelete, children: t("Jatka") }, void 0)] }, void 0)] }, void 0)] }, void 0)), (0, jsx_runtime_1.jsx)(sheet_1.SheetClose, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: onSave, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-4" }, void 0), t("Tallenna")] }, void 0) }, void 0)] }, void 0)] }, void 0));
}
//# sourceMappingURL=CivilianSheet.js.map