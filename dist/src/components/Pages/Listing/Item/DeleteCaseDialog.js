"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCaseDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const mutations_1 = require("@/hooks/mutations");
const react_i18next_1 = require("react-i18next");
const immer_1 = require("immer");
function DeleteCaseDialog({ currentCase, currentListing, open, onOpenChange, }) {
    const updateListing = (0, mutations_1.useMutateCurrentListing)();
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogContent, { children: [(0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogHeader, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTitle, { children: (0, jsx_runtime_1.jsxs)("span", { children: [t("Poista asia"), " ", currentCase.caseNumber] }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogDescription, { children: t("Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogFooter, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogCancel, { children: t("Peruuta") }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogAction, { onClick: () => {
                                updateListing.mutate((0, immer_1.produce)(currentListing, (draft) => {
                                    draft.cases = draft.cases.filter((c) => c.id !== currentCase.id);
                                }));
                            }, children: t("Jatka") }, void 0)] }, void 0)] }, void 0) }, void 0));
}
exports.DeleteCaseDialog = DeleteCaseDialog;
//# sourceMappingURL=DeleteCaseDialog.js.map