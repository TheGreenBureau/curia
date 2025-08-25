"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button");
const utils_1 = require("@/lib/utils");
const immer_1 = require("immer");
const mutations_1 = require("@/hooks/mutations");
const react_i18next_1 = require("react-i18next");
const lucide_react_1 = require("lucide-react");
const ListingDocument_1 = require("@/components/pdf/ListingDocument");
const rowcol_1 = require("@/components/ui/rowcol");
const DocumentDialog_1 = require("./DocumentDialog");
const date_fns_1 = require("date-fns");
const renderer_1 = require("@react-pdf/renderer");
const react_1 = require("react");
const ProsecutorListingDocument_1 = require("@/components/pdf/ProsecutorListingDocument");
function ListingMenu({ listing, onOpenCaseSheet, office, ...rest }) {
    const updateListing = (0, mutations_1.useMutateCurrentListing)();
    const openCSV = (0, mutations_1.useMutateOpenCSV)();
    const [documentPreview, setDocumentPreview] = (0, react_1.useState)(null);
    const { t } = (0, react_i18next_1.useTranslation)();
    const sortCasesByTime = () => {
        const sorted = (0, immer_1.produce)(listing.cases, (draft) => {
            draft.sort((a, b) => {
                const aDate = new Date(a.time);
                const bDate = new Date(b.time);
                const date1 = new Date();
                const date2 = new Date();
                date1.setHours(aDate.getHours(), aDate.getMinutes());
                date2.setHours(bDate.getHours(), bDate.getMinutes());
                return (0, utils_1.sortDates)(date1, date2, "asc");
            });
        });
        updateListing.mutate((0, immer_1.produce)(listing, (draft) => {
            draft.cases = sorted;
        }));
    };
    const formatSaveName = (prosecutor) => {
        const type = prosecutor
            ? t("Syyttäjä", { count: 1 }).toUpperCase()
            : t("Julkinen").toUpperCase();
        return `${[
            (0, date_fns_1.format)(rest.date, "yyyy-MM-dd"),
            rest.court.abbreviation,
            Object.keys(rest.court.offices).length > 1 ? office?.name ?? null : null,
            rest.room ?? null,
        ]
            .filter((p) => p !== null)
            .join(" ")}, ${type}.pdf`;
    };
    const buttonClasses = "h-10 w-10 px-0 py-0 actionmenu:h-10 actionmenu:px-4 actionmenu:py-2 actionmenu:w-auto";
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: "justify-end flex-1 items-center", children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: buttonClasses, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FilePen, { className: "h-5 w-5" }, void 0), (0, jsx_runtime_1.jsx)("span", { className: "hidden actionmenu:inline-block actionmenu:ml-2", children: t("Muokkaa") }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: () => sortCasesByTime(), disabled: (0, utils_1.isDateArraySortedByTime)(listing.cases.map((c) => new Date(c.time))), className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "mr-2 h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)("span", { children: t("Aikajärjestys") }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: onOpenCaseSheet, className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)("span", { children: t("Luo uusi") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { className: "cursor-pointer", onClick: () => openCSV.mutate({ type: "criminal", currentListing: listing }), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Text, { className: "mr-2 h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)("span", { children: t("Tuo CSV") }, void 0)] }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: buttonClasses, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-5 w-5" }, void 0), (0, jsx_runtime_1.jsx)("span", { className: "hidden actionmenu:inline-block actionmenu:ml-2", children: t("Tarkista") }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: () => setDocumentPreview("public"), className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "mr-2 h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)("span", { children: t("Julkinen") }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: () => setDocumentPreview("prosecutor"), className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Section, { className: "mr-2 h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)("span", { children: t("Syyttäjä", "Syyttäjä", { count: 1 }) }, void 0)] }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: buttonClasses, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "h-5 w-5" }, void 0), (0, jsx_runtime_1.jsx)("span", { className: "hidden actionmenu:inline-block actionmenu:ml-2", children: t("Tallenna") }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "mr-2 h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.PDFDownloadLink, { document: (0, jsx_runtime_1.jsx)(ListingDocument_1.ListingDocument, { ...rest }, void 0), fileName: formatSaveName(), children: t("Julkinen") }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}, void 0), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Section, { className: "mr-2 h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.PDFDownloadLink, { document: (0, jsx_runtime_1.jsx)(ProsecutorListingDocument_1.ProsecutorListingDocument, { ...rest }, void 0), fileName: formatSaveName(true), children: t("Syyttäjä", "Syyttäjä", { count: 1 }) }, void 0)] }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(DocumentDialog_1.DocumentDialog, { prosecutor: documentPreview === "prosecutor", open: Boolean(documentPreview), onOpenChange: (open) => {
                    if (!open) {
                        setDocumentPreview(null);
                    }
                }, ...rest }, void 0)] }, void 0));
}
exports.ListingMenu = ListingMenu;
//# sourceMappingURL=ListingMenu.js.map