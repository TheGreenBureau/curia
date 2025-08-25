"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingDateSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const date_time_picker_1 = require("@/components/ui/date-time-picker");
const rowcol_1 = require("@/components/ui/rowcol");
const select_1 = require("@/components/ui/select");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const fi_1 = require("date-fns/locale/fi");
const sv_1 = require("date-fns/locale/sv");
const button_1 = require("@/components/ui/button");
const utils_1 = require("@/lib/utils");
const headings_1 = require("@/components/ui/headings");
function ListingDateSelector({ className, onDateSelected, selectionActive, onClearSelection, }) {
    const [type, setType] = (0, react_1.useState)("before");
    const [date, setDate] = (0, react_1.useState)(new Date());
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const handleClick = () => {
        if (selectionActive) {
            onClearSelection();
        }
        else {
            onDateSelected({ date, type });
        }
    };
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Col, { className: "w-full", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: (0, utils_1.cn)(selectionActive && "text-teal-500"), children: t("Valitse päivämäärällä") }, void 0), (0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: "items-center gap-4 w-full", children: [(0, jsx_runtime_1.jsxs)(select_1.Select, { value: type, onValueChange: (value) => setType(value), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: (0, utils_1.cn)("max-w-52", className), children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "before", children: t("Ennen") }, void 0), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "after", children: t("Jälkeen") }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(date_time_picker_1.DateTimePicker, { value: date, locale: i18n.resolvedLanguage === "sv" ? sv_1.sv : fi_1.fi, granularity: "day", onChange: (date) => setDate(date ?? new Date()), displayFormat: { hour24: "dd.MM.yyyy" } }, void 0), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: handleClick, className: "w-96", children: selectionActive ? t("Poista valinnat") : t("Valitse") }, void 0)] }, void 0)] }, void 0));
}
exports.ListingDateSelector = ListingDateSelector;
//# sourceMappingURL=ListingDateSelector.js.map