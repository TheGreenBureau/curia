"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useResources_1 = require("@/hooks/useResources");
const dataFormat_1 = require("@/lib/dataFormat");
const immer_1 = require("immer");
const react_i18next_1 = require("react-i18next");
const alert_1 = require("@/components/ui/alert");
const lucide_react_1 = require("lucide-react");
const combobox_1 = require("@/components/ui/combobox");
const headings_1 = require("@/components/ui/headings");
const label_1 = require("@/components/ui/label");
function CourtSelector({ onChange, values, hasTitle, }) {
    const resources = (0, useResources_1.useResources)();
    const { t } = (0, react_i18next_1.useTranslation)();
    if (resources.isError) {
        return ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { variant: "destructive", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertTitle, { children: t("Virhe") }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: t("Valintoja ei voitu noutaa.") }, void 0)] }, void 0));
    }
    if (resources.isSuccess) {
        const { options, currentCourt, currentOffice } = (0, dataFormat_1.optionsFromCourtValues)(values, resources.data);
        const handleSelectionChange = (type, value) => {
            if (values[type] === value) {
                return;
            }
            const court = resources.data.courts?.find((c) => c.id === (type === "court" ? value : values.court));
            const departments = court?.departments;
            const offices = court?.offices;
            const department = departments && departments.length === 1 ? departments[0].id : "";
            const office = offices && offices.length === 1 ? offices[0].id : "";
            const rooms = office !== "" && offices?.find((o) => o.id === office)?.rooms;
            const room = rooms && rooms.length === 1 ? rooms[0].id : "";
            let newValues = values;
            switch (type) {
                case "court":
                    newValues = (0, immer_1.produce)(values, (draft) => {
                        draft.court = value;
                        draft.department = department;
                        draft.office = office;
                        draft.room = room;
                    });
                    break;
                case "department":
                    if (!currentCourt)
                        break;
                    newValues = (0, immer_1.produce)(values, (draft) => {
                        draft.department = value;
                    });
                    break;
                case "office":
                    newValues = (0, immer_1.produce)(values, (draft) => {
                        draft.office = value;
                        draft.room = room;
                    });
                    break;
                default:
                    newValues = (0, immer_1.produce)(values, (draft) => {
                        draft.room = value;
                    });
                    break;
            }
            onChange(newValues, (0, dataFormat_1.validateCourtChoices)(newValues, options.departments));
        };
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-4 w-full items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-4 w-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-4 items-start gap-4", children: hasTitle && ((0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h5", className: "col-span-3 col-start-2", children: t("Istunto") }, void 0)) }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Tuomioistuin") }, void 0), (0, jsx_runtime_1.jsx)(combobox_1.Combobox, { className: "col-span-3", options: options.courts, disabled: resources.isPending || resources.isFetching, value: values.court, onChange: (currentValue) => handleSelectionChange("court", currentValue), placeholderSelect: t("Valitse") }, void 0)] }, void 0), options.departments.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Osasto") }, void 0), (0, jsx_runtime_1.jsx)(combobox_1.Combobox, { className: "col-span-3", options: options.departments, disabled: resources.isPending ||
                                    resources.isFetching ||
                                    !currentCourt ||
                                    currentCourt.departments.length <= 1, value: values.department, onChange: (currentValue) => handleSelectionChange("department", currentValue), placeholderSelect: t("Valitse"), placeholderDisabled: t("Valitse edeltävä") }, void 0)] }, void 0)), options.offices.length > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Kanslia") }, void 0), (0, jsx_runtime_1.jsx)(combobox_1.Combobox, { className: "col-span-3", options: options.offices, disabled: resources.isPending ||
                                    resources.isFetching ||
                                    (options.departments.length > 0 &&
                                        values.department === "") ||
                                    !currentCourt ||
                                    currentCourt.offices.length <= 1, value: values.office, onChange: (currentValue) => handleSelectionChange("office", currentValue), placeholderSelect: t("Valitse"), placeholderDisabled: t("Valitse edeltävä") }, void 0)] }, void 0)), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Sali") }, void 0), (0, jsx_runtime_1.jsx)(combobox_1.Combobox, { className: "col-span-3", options: options.rooms, disabled: resources.isPending ||
                                    resources.isFetching ||
                                    values.office === "" ||
                                    !currentOffice ||
                                    currentOffice.rooms.length <= 1, value: values.room, onChange: (currentValue) => handleSelectionChange("room", currentValue), placeholderSelect: t("Valitse"), placeholderDisabled: t("Valitse edeltävä") }, void 0)] }, void 0)] }, void 0) }, void 0));
    }
}
exports.CourtSelector = CourtSelector;
//# sourceMappingURL=CourtSelector.js.map