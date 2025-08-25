"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionEditSheet = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const button_1 = require("@/components/ui/button");
const sheet_1 = require("@/components/ui/sheet");
const CourtSelector_1 = require("@/components/CourtSelector");
const mutations_1 = require("@/hooks/mutations");
const lucide_react_1 = require("lucide-react");
const react_i18next_1 = require("react-i18next");
const immer_1 = require("immer");
const date_time_picker_1 = require("@/components/ui/date-time-picker");
const fi_1 = require("date-fns/locale/fi");
const sv_1 = require("date-fns/locale/sv");
const react_1 = require("react");
const label_1 = require("@/components/ui/label");
const checkbox_1 = require("@/components/ui/checkbox");
const useLanguage_1 = require("@/hooks/useLanguage");
const textarea_1 = require("@/components/ui/textarea");
const case_1 = require("@/types/data/case");
const separator_1 = require("@/components/ui/separator");
const PublicityButton_1 = require("./PublicityButton");
const locales = {
    fi: fi_1.fi,
    sv: sv_1.sv,
};
function SessionEditSheet({ getListing }) {
    const [currentDate, setCurrentDate] = (0, react_1.useState)(new Date());
    const [currentBreak, setCurrentBreak] = (0, react_1.useState)(() => {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        return date;
    });
    const [currentNotes, setCurrentNotes] = (0, react_1.useState)();
    const [notePublicity, setNotePublicity] = (0, react_1.useState)("private");
    const [breakActive, setBreakActive] = (0, react_1.useState)(false);
    const [values, setValues] = (0, react_1.useState)();
    const [valid, setValid] = (0, react_1.useState)(true);
    const updateListing = (0, mutations_1.useMutateCurrentListing)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [language] = (0, useLanguage_1.useLanguage)();
    const assignListing = () => {
        const listing = getListing();
        setValues({
            ...listing,
        });
        setCurrentDate(new Date(listing.date));
        if (listing.break) {
            setCurrentBreak(listing.break);
            setBreakActive(true);
        }
        setCurrentNotes(listing.notes);
        setNotePublicity(listing.notePublicity ?? "private");
    };
    const onPublicityClick = () => {
        const pubIndex = case_1.notePublicityTypes.indexOf(notePublicity);
        if (pubIndex === -1 || pubIndex === case_1.notePublicityTypes.length - 1) {
            setNotePublicity("private");
            return;
        }
        setNotePublicity(case_1.notePublicityTypes[pubIndex + 1]);
    };
    return ((0, jsx_runtime_1.jsxs)(sheet_1.Sheet, { children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", onClick: assignListing, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, {}, void 0) }, void 0) }, void 0), values && ((0, jsx_runtime_1.jsxs)(sheet_1.SheetContent, { side: "left", className: "sm:max-w-md", children: [(0, jsx_runtime_1.jsxs)(sheet_1.SheetHeader, { children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTitle, { children: t("Muokkaa tietoja") }, void 0), (0, jsx_runtime_1.jsx)(sheet_1.SheetDescription, { children: t("Tässä voit muokata tuomioistuimeen ja päivämäärään liittyviä yleisiä tietoja.") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-full justify-center gap-4 mt-6", children: [(0, jsx_runtime_1.jsx)(CourtSelector_1.CourtSelector, { values: { ...values }, onChange: (values, validated) => {
                                    setValues({ ...values });
                                    setValid(validated);
                                } }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Päivämäärä") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-3", children: (0, jsx_runtime_1.jsx)(date_time_picker_1.DateTimePicker, { value: currentDate, locale: locales[language], onChange: (selected) => setCurrentDate(selected ?? new Date()), granularity: "day", displayFormat: { hour24: "dd.MM.yyyy" } }, void 0) }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-8 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right col-span-2", children: t("Tauko") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-1", children: (0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { className: "h-5 w-5", checked: breakActive, onCheckedChange: (checked) => {
                                                if (checked === "indeterminate") {
                                                    return;
                                                }
                                                setBreakActive(checked);
                                            } }, void 0) }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-5", children: (0, jsx_runtime_1.jsx)(date_time_picker_1.TimePicker, { disabled: !breakActive, date: currentBreak, onChange: (selected) => setCurrentBreak(selected), granularity: "minute" }, void 0) }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "my-6" }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Huomioita") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-3", children: (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { value: currentNotes, onChange: (e) => setCurrentNotes(e.currentTarget.value) }, void 0) }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-4 items-center gap-4", children: (0, jsx_runtime_1.jsx)("div", { className: "col-start-2 col-span-3 ml-4", children: (0, jsx_runtime_1.jsx)(PublicityButton_1.PublicityButton, { publicity: notePublicity, onClick: onPublicityClick, className: "font-semibold text-sm" }, void 0) }, void 0) }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(sheet_1.SheetFooter, { children: (0, jsx_runtime_1.jsx)(sheet_1.SheetClose, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "mt-6 ", size: "lg", disabled: !valid, onClick: () => {
                                    updateListing.mutate((0, immer_1.produce)(getListing(), (draft) => {
                                        draft.court = values.court;
                                        draft.office = values.office;
                                        draft.department = values.department;
                                        draft.room = values.room;
                                        draft.date = currentDate;
                                        draft.break = breakActive ? currentBreak : undefined;
                                        draft.notes = currentNotes;
                                        draft.notePublicity = notePublicity;
                                    }));
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-4" }, void 0), t("Tallenna")] }, void 0) }, void 0) }, void 0)] }, void 0))] }, void 0));
}
exports.SessionEditSheet = SessionEditSheet;
//# sourceMappingURL=SessionEditSheet.js.map