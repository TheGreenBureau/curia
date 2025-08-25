"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicityButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const rowcol_1 = require("@/components/ui/rowcol");
const utils_1 = require("@/lib/utils");
const react_i18next_1 = require("react-i18next");
const lucide_react_1 = require("lucide-react");
function PublicityButton({ publicity, onClick, className, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const color = () => {
        switch (publicity) {
            case "public":
                return "text-sky-600 dark:text-sky-400";
            case "prosecutor":
                return "text-purple-600 dark:text-purple-400";
            default:
                return "";
        }
    };
    const buttonClasses = "h-4 w-4 cursor-pointer hover:opacity-80";
    const Icon = () => {
        switch (publicity) {
            case "private":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: buttonClasses }, void 0);
            case "public":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: buttonClasses }, void 0);
            case "prosecutor":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Section, { className: buttonClasses }, void 0);
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: (0, utils_1.cn)("cursor-pointer hover:opacity-80 transition-opacity duration-200 gap-2 items-center font-semibold", className), onClick: onClick, children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("transition-colors duration-100", color()), children: (0, jsx_runtime_1.jsx)(Icon, {}, void 0) }, void 0), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("select-none transition-colors duration-100", color()), children: t(publicity) }, void 0)] }, void 0));
}
exports.PublicityButton = PublicityButton;
//# sourceMappingURL=PublicityButton.js.map