"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageToggle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const button_1 = require("@/components/ui/button");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const useLanguage_1 = require("@/hooks/useLanguage");
const utils_1 = require("@/lib/utils");
function LanguageToggle() {
    const [language, setLanguage] = (0, useLanguage_1.useLanguage)();
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "icon", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("absolute scale-100 transition-all duration-150 text-center", language === "sv" && "scale-0"), children: "FI" }, void 0), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("absolute scale-0 transition-all duration-150 text-center", language === "sv" && "scale-100"), children: "SV" }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { align: "end", children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { onClick: () => setLanguage("fi"), children: "Suomi" }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { onClick: () => setLanguage("sv"), children: "Svenska" }, void 0)] }, void 0)] }, void 0));
}
exports.LanguageToggle = LanguageToggle;
//# sourceMappingURL=LanguageToggle.js.map