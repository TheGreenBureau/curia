"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProsecutorTitleSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const headings_1 = require("@/components/ui/headings");
const label_1 = require("@/components/ui/label");
const combocreate_1 = require("@/components/ui/combocreate");
const useResources_1 = require("@/hooks/useResources");
const dataFormat_1 = require("@/lib/dataFormat");
const react_i18next_1 = require("react-i18next");
function ProsecutorTitleSelector({ value, onChange, }) {
    const resources = (0, useResources_1.useResources)();
    const { t } = (0, react_i18next_1.useTranslation)();
    if (resources.isSuccess) {
        const titleOptions = (0, dataFormat_1.optionsFromRecord)(resources.data.prosecutorTitles);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h5", className: "col-start-2 col-span-3 mt-0", children: t("Syyttäjä", "Syyttäjä", { count: 2 }) }, void 0), (0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Virkanimike") }, void 0), (0, jsx_runtime_1.jsx)(combocreate_1.ComboCreate, { className: "col-span-3", triggerClassName: "col-span-3", options: titleOptions, value: value, onChange: (currentValue) => onChange(currentValue) }, void 0)] }, void 0));
    }
}
exports.ProsecutorTitleSelector = ProsecutorTitleSelector;
//# sourceMappingURL=ProsecutorTitleSelector.js.map