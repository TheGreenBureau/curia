"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeToggle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const ThemeProvider_1 = require("@/components/ThemeProvider");
const react_i18next_1 = require("react-i18next");
function ModeToggle() {
    const { setTheme } = (0, ThemeProvider_1.useTheme)();
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "icon", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }, void 0), (0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }, void 0), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: t("Teema") }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { align: "end", children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { onClick: () => setTheme("light"), children: t("Vaalea") }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { onClick: () => setTheme("dark"), children: t("Tumma") }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { onClick: () => setTheme("system"), children: t("Järjestelmä") }, void 0)] }, void 0)] }, void 0));
}
exports.ModeToggle = ModeToggle;
//# sourceMappingURL=ModeToggle.js.map