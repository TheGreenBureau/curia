"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const dialog_1 = require("@/components/ui/dialog");
const ListingDocument_1 = require("@/components/pdf/ListingDocument");
const react_i18next_1 = require("react-i18next");
const renderer_1 = require("@react-pdf/renderer");
const ProsecutorListingDocument_1 = require("@/components/pdf/ProsecutorListingDocument");
function DocumentDialog(props) {
    const { prosecutor, open, onOpenChange, ...rest } = props;
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-4xl", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: `${t("Esikatselu")} ${prosecutor
                            ? t("Syyttäjä", "Syyttäjä", { count: 1 }).toLowerCase()
                            : t("Julkinen").toLowerCase()}` }, void 0) }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-row justify-center h-[80vh]", children: (0, jsx_runtime_1.jsx)(renderer_1.PDFViewer, { showToolbar: false, className: "w-full h-full rounded-lg ", children: prosecutor ? ((0, jsx_runtime_1.jsx)(ProsecutorListingDocument_1.ProsecutorListingDocument, { ...rest }, void 0)) : ((0, jsx_runtime_1.jsx)(ListingDocument_1.ListingDocument, { ...rest }, void 0)) }, void 0) }, void 0)] }, void 0) }, void 0));
}
exports.DocumentDialog = DocumentDialog;
//# sourceMappingURL=DocumentDialog.js.map