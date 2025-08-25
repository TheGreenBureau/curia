"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseSheet = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const date_time_picker_1 = require("@/components/ui/date-time-picker");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const sheet_1 = require("@/components/ui/sheet");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/components/ui/button");
const OfficerSelector_1 = require("@/components/OfficerSelector");
const immer_1 = require("immer");
const lucide_react_1 = require("lucide-react");
const select_1 = require("@/components/ui/select");
const separator_1 = require("@/components/ui/separator");
const react_1 = require("react");
const mutations_1 = require("@/hooks/mutations");
const queries_1 = require("@/hooks/queries");
const useStore_1 = require("@/hooks/useStore");
const uuid_1 = require("uuid");
const combocreate_1 = require("@/components/ui/combocreate");
function CaseSheet({ getCase, open, onOpenChange }) {
    const [currentCase, setCurrentCase] = (0, react_1.useState)(null);
    const currentListing = (0, useStore_1.useStore)((state) => state.currentListing);
    const updateListing = (0, mutations_1.useMutateCurrentListing)();
    const defaults = (0, queries_1.useDefaults)();
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        if (open) {
            const given = getCase();
            if (given.id === "") {
                given.officers = [
                    defaults.data?.presiding ?? null,
                    defaults.data?.secretary ?? null,
                ].filter((o) => o !== null);
            }
            setCurrentCase(given);
        }
    }, [open]);
    const updateCase = (key, value) => {
        if (!currentCase)
            return;
        setCurrentCase((0, immer_1.produce)(currentCase, (draft) => {
            draft[key] = value;
        }));
    };
    const isNew = currentCase && currentCase.id === "";
    if (currentCase && defaults.isSuccess) {
        return ((0, jsx_runtime_1.jsx)(sheet_1.Sheet, { open: open, onOpenChange: onOpenChange, children: currentCase && ((0, jsx_runtime_1.jsxs)(sheet_1.SheetContent, { side: "right", className: "sm:max-w-md", children: [(0, jsx_runtime_1.jsxs)(sheet_1.SheetHeader, { children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTitle, { children: currentCase.id === "" ? t("Uusi juttu") : t("Muokkaa tietoja") }, void 0), (0, jsx_runtime_1.jsx)(sheet_1.SheetDescription, { children: currentCase.id === ""
                                    ? t("Syötä uuden jutun tiedot.")
                                    : t("Muokkaa jutun tietoja ja klikkaa tallenna, kun olet valmis.") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-4 w-full mt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Asiatyyppi") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-3", children: (0, jsx_runtime_1.jsxs)(select_1.Select, { value: currentCase.type, onValueChange: (value) => updateCase("type", value), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-full", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: t("Valitse") }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: (0, jsx_runtime_1.jsxs)(select_1.SelectGroup, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "criminal", children: t("Rikosasia") }, void 0), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "civil", children: t("Siviiliasia") }, void 0)] }, void 0) }, void 0)] }, void 0) }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "my-4" }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "case-number", className: "text-right", children: t("Asianumero") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "case-number", value: currentCase.caseNumber, className: "col-span-3", onChange: (e) => updateCase("caseNumber", e.target.value) }, void 0)] }, void 0), currentCase.type === "criminal" && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "prosecutor-number", className: "text-right", children: t("Asianro sjä") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "prosecutor-number", value: currentCase.prosecutorCaseNumber, className: "col-span-3", onChange: (e) => updateCase("prosecutorCaseNumber", e.target.value) }, void 0)] }, void 0)), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "matter", className: "text-right", children: t("Asia") }, void 0), (0, jsx_runtime_1.jsx)(combocreate_1.ComboCreateCrime, { className: "col-span-3", placeholder: t("Kirjoita tai valitse..."), value: currentCase.matter, onChange: (value) => updateCase("matter", value) }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Kellonaika") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-3", children: (0, jsx_runtime_1.jsx)(date_time_picker_1.TimePicker, { date: currentCase.time, onChange: (date) => updateCase("time", date ?? currentCase.time), granularity: "minute" }, void 0) }, void 0)] }, void 0), isNew && ((0, jsx_runtime_1.jsx)(OfficerSelector_1.OfficerSelector, { values: {
                                    presiding: currentCase.officers.find((o) => o.type === "presiding") ??
                                        defaults?.data.presiding ??
                                        null,
                                    secretary: currentCase.officers.find((o) => o.type === "secretary") ??
                                        defaults?.data.secretary ??
                                        null,
                                }, onChange: (values) => {
                                    updateCase("officers", [values.presiding, values.secretary].filter((o) => o !== null));
                                } }, void 0))] }, void 0), (0, jsx_runtime_1.jsx)(sheet_1.SheetFooter, { children: currentListing && ((0, jsx_runtime_1.jsx)(sheet_1.SheetClose, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "mt-6 ", size: "lg", onClick: () => {
                                    updateListing.mutate((0, immer_1.produce)(currentListing, (draft) => {
                                        if (isNew) {
                                            draft.cases.push({
                                                ...currentCase,
                                                id: (0, uuid_1.v4)(),
                                            });
                                        }
                                        const index = draft.cases.findIndex((c) => c.id === currentCase.id);
                                        if (index !== -1) {
                                            draft.cases[index] = currentCase;
                                        }
                                    }));
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-4" }, void 0), t("Tallenna")] }, void 0) }, void 0)) }, void 0)] }, void 0)) }, void 0));
    }
}
exports.CaseSheet = CaseSheet;
//# sourceMappingURL=CaseSheet.js.map