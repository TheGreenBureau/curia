"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuSubItem = exports.MenuItem = exports.ItemMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function ItemMenu({ children, className, }) {
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", className: className, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "w-4 h-4" }, void 0) }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuContent, { className: "w-56", children: children }, void 0)] }, void 0));
}
exports.ItemMenu = ItemMenu;
function MenuItem({ children, onClick, icon, }) {
    const Icon = icon;
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: onClick, children: [Icon && (0, jsx_runtime_1.jsx)(Icon, { className: "mr-2 h-4 w-4" }, void 0), children] }, void 0));
}
exports.MenuItem = MenuItem;
function MenuSubItem({ children, icon, triggerContent, className, }) {
    const Icon = icon;
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuSub, { children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuSubTrigger, { className: className, children: [Icon && (0, jsx_runtime_1.jsx)(Icon, { className: "mr-2 h-4 w-4" }, void 0), triggerContent] }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuPortal, { children: (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSubContent, { className: "p-4", children: children }, void 0) }, void 0)] }, void 0));
}
exports.MenuSubItem = MenuSubItem;
//# sourceMappingURL=ItemMenu.js.map