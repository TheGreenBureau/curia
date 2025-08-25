"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const headings_1 = require("@/components/ui/headings");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const useCases_1 = require("@/hooks/useCases");
const rowcol_1 = require("@/components/ui/rowcol");
const react_i18next_1 = require("react-i18next");
const ItemMenu_1 = require("@/components/Pages/Listing/Item/ItemMenu");
const Notes_1 = require("./Notes");
const Civilians_1 = require("@/components/Pages/Listing/Item/Civilians");
const Officers_1 = require("./Officers");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const CaseNumbers_1 = require("./CaseNumbers");
const Matter_1 = require("./Matter");
const Time_1 = require("./Time");
const DeleteCaseDialog_1 = require("./DeleteCaseDialog");
exports.Item = (0, react_1.forwardRef)(({ item, index, style, attributes, listeners, className }, ref) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = (0, react_1.useState)(false);
    const caseQuery = (0, useCases_1.useCase)(item);
    const { currentCase } = caseQuery;
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)("div", { ref: ref, style: style, children: (0, jsx_runtime_1.jsx)(card_1.Card, { className: (0, utils_1.cn)("w-full pt-4 transition-colors duration-100", currentCase?.confidential && "border-rose-500", className), children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "relative", children: [(0, jsx_runtime_1.jsxs)(rowcol_1.Row, { children: [(0, jsx_runtime_1.jsxs)(rowcol_1.Col, { className: "w-28", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "m-0", children: t("Nro") }, void 0), (0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: "gap-2 items-center justify-start", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h2", className: "m-0", children: index + 1 }, void 0), (0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "cursor-grab outline-none", ...attributes, ...listeners }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: "gap-10 justify-start mr-10 w-full", children: [(0, jsx_runtime_1.jsx)(Time_1.Time, { heading: t("Kellonaika"), ...caseQuery }, void 0), (0, jsx_runtime_1.jsx)(Matter_1.Matter, { heading: t("Asia"), ...caseQuery }, void 0), (0, jsx_runtime_1.jsx)(CaseNumbers_1.CaseNumbers, { className: "hidden casenumbers:flex", ...caseQuery, heading: currentCase.type === "civil"
                                            ? t("Asianumero")
                                            : t("Asianumerot") }, void 0), (0, jsx_runtime_1.jsx)(Officers_1.Officers, { className: "hidden officers:flex", currentCase: currentCase, heading: t("Virkamiehet") }, void 0), (0, jsx_runtime_1.jsx)(Civilians_1.Civilians, { className: "hidden civilians:flex", currentCase: currentCase, heading: t("Siviilit") }, void 0), (0, jsx_runtime_1.jsx)(Notes_1.Notes, { className: "hidden notes:flex", heading: t("Huomioita"), ...caseQuery }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(ItemMenu_1.ItemMenu, { className: "absolute right-2 -top-2", children: [(0, jsx_runtime_1.jsx)(ItemMenu_1.MenuSubItem, { icon: lucide_react_1.Hash, triggerContent: currentCase.type === "civil"
                                    ? t("Asianumero")
                                    : t("Asianumerot"), className: "casenumbers:hidden", children: (0, jsx_runtime_1.jsx)(CaseNumbers_1.CaseNumbers, { ...caseQuery, heading: currentCase.type === "civil"
                                        ? t("Asianumero")
                                        : t("Asianumerot") }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(ItemMenu_1.MenuSubItem, { icon: lucide_react_1.Scale, triggerContent: t("Virkamiehet"), className: "officers:hidden", children: (0, jsx_runtime_1.jsx)(Officers_1.Officers, { currentCase: currentCase, heading: t("Virkamiehet") }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(ItemMenu_1.MenuSubItem, { icon: lucide_react_1.User, triggerContent: t("Siviilit"), className: "civilians:hidden", children: (0, jsx_runtime_1.jsx)(Civilians_1.Civilians, { currentCase: currentCase, heading: t("Siviilit") }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(ItemMenu_1.MenuSubItem, { icon: lucide_react_1.NotebookPen, triggerContent: t("Huomioita"), className: "notes:hidden", children: (0, jsx_runtime_1.jsx)(Notes_1.Notes, { ...caseQuery, heading: t("Huomioita") }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, { className: "notes:hidden" }, void 0), (0, jsx_runtime_1.jsx)(ItemMenu_1.MenuItem, { onClick: () => setDeleteDialogOpen(true), icon: lucide_react_1.Trash, children: t("Poista") }, void 0)] }, void 0), currentCase && caseQuery.currentListing && ((0, jsx_runtime_1.jsx)(DeleteCaseDialog_1.DeleteCaseDialog, { currentCase: currentCase, currentListing: caseQuery.currentListing, open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen }, void 0))] }, void 0) }, void 0) }, void 0));
});
//# sourceMappingURL=index.js.map