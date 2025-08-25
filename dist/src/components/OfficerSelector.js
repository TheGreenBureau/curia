"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficerSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useResources_1 = require("@/hooks/useResources");
const react_i18next_1 = require("react-i18next");
const alert_1 = require("@/components/ui/alert");
const lucide_react_1 = require("lucide-react");
const immer_1 = require("immer");
const uuid_1 = require("uuid");
const input_1 = require("@/components/ui/input");
const headings_1 = require("@/components/ui/headings");
const label_1 = require("./ui/label");
const combocreate_1 = require("./ui/combocreate");
const dataFormat_1 = require("@/lib/dataFormat");
function OfficerSelector({ onChange, values }) {
    const resources = (0, useResources_1.useResources)();
    const titleOptions = (0, dataFormat_1.optionsFromRecord)(resources.data?.courtTitles);
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleChange = (type, prop, value) => {
        if (!values[type]) {
            onChange((0, immer_1.produce)(values, (draft) => {
                draft[type] = {
                    type: type,
                    id: (0, uuid_1.v4)(),
                    name: prop === "name" ? value ?? "" : "",
                    title: prop === "title" ? value ?? undefined : undefined,
                };
            }));
            return;
        }
        if (values[type][prop] === value) {
            return;
        }
        onChange((0, immer_1.produce)(values, (draft) => {
            if (!draft[type])
                return;
            draft[type][prop] = value;
            if (prop === "name" && value === "") {
                draft[type].title = "";
            }
        }));
    };
    if (resources.isError) {
        return ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { variant: "destructive", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertTitle, { children: t("Virhe") }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: t("Valintoja ei voitu noutaa.") }, void 0)] }, void 0));
    }
    if (resources.isSuccess) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center w-full gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "grid gap-4 w-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h5", className: "col-start-2 col-span-3", children: t("Puheenjohtaja") }, void 0), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "presiding-name", className: "text-right", children: t("Nimi") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "presiding-name", value: values?.presiding?.name ?? "", onChange: (e) => handleChange("presiding", "name", e.target.value), onClear: () => handleChange("presiding", "name", ""), className: "col-span-3" }, void 0), (0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Virkanimike") }, void 0), (0, jsx_runtime_1.jsx)(combocreate_1.ComboCreate, { className: "col-span-3", options: titleOptions, disabled: resources.isPending ||
                                    resources.isFetching ||
                                    !values.presiding ||
                                    values.presiding.name === "", value: values.presiding?.title ?? "", onChange: (currentValue) => handleChange("presiding", "title", currentValue), placeholder: t("Kirjoita tai valitse..."), placeholderDisabled: t("Valitse edeltävä") }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-4 w-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h5", className: "col-start-2 col-span-3", children: t("strings:Pöytäkirjanpitäjä", "Pöytäkirjanpitäjä", {
                                    count: 1,
                                }) }, void 0), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "secretary-name", className: "text-right", children: t("Nimi") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "secretary-name", value: values?.secretary?.name ?? "", onChange: (e) => handleChange("secretary", "name", e.target.value), onClear: () => handleChange("secretary", "name", ""), className: "col-span-3" }, void 0), (0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Virkanimike") }, void 0), (0, jsx_runtime_1.jsx)(combocreate_1.ComboCreate, { className: "col-span-3", options: titleOptions, disabled: resources.isPending ||
                                    resources.isFetching ||
                                    !values.secretary ||
                                    values.secretary.name === "", value: values.secretary?.title ?? "", onChange: (currentValue) => {
                                    handleChange("secretary", "title", currentValue);
                                }, placeholder: t("Kirjoita tai valitse..."), placeholderDisabled: t("Valitse edeltävä") }, void 0)] }, void 0) }, void 0)] }, void 0));
    }
}
exports.OfficerSelector = OfficerSelector;
//# sourceMappingURL=OfficerSelector.js.map