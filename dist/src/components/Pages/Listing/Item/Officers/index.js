"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Officers = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const headings_1 = require("@/components/ui/headings");
const rowcol_1 = require("@/components/ui/rowcol");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const react_i18next_1 = require("react-i18next");
const OfficerSheet_1 = require("@/components/Pages/Listing/Item/Officers/OfficerSheet");
const OfficerList_1 = require("@/components/Pages/Listing/Item/Officers/OfficerList");
function Officers({ currentCase, heading, className, newOfficerTrigger, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Col, { className: className, children: [(0, jsx_runtime_1.jsxs)(rowcol_1.Row, { children: [heading && ((0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "m-0", children: heading }, void 0)), (0, jsx_runtime_1.jsx)(OfficerSheet_1.OfficerSheet, { getOfficer: () => {
                            return {
                                id: "",
                                name: "",
                                title: "",
                                type: "presiding",
                            };
                        }, currentCase: currentCase, children: newOfficerTrigger ? (newOfficerTrigger) : ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "icon", className: "h-6 w-6", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }, void 0) }, void 0)) }, void 0)] }, void 0), currentCase.officers.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground min-w-[15.75rem] max-w-48", children: t("Ei henkilöitä") }, void 0)) : ((0, jsx_runtime_1.jsx)(OfficerList_1.OfficerList, { currentCase: currentCase }, void 0))] }, void 0));
}
exports.Officers = Officers;
//# sourceMappingURL=index.js.map