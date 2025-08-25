"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const rowcol_1 = require("@/components/ui/rowcol");
const headings_1 = require("@/components/ui/headings");
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
const react_i18next_1 = require("react-i18next");
const combocreate_1 = require("@/components/ui/combocreate");
function Matter({ className, heading, currentCase, updateCase, saveCase, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Col, { className: className, children: [heading && ((0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: (0, utils_1.cn)("items-center gap-2", currentCase.confidential && "text-rose-500"), children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "m-0 transition-colors duration-100 select-none", children: heading }, void 0), currentCase.confidential ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "h-4 w-4 cursor-pointer hover:opacity-80", onClick: () => {
                            saveCase({
                                ...currentCase,
                                confidential: false,
                            });
                        } }, void 0)) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ShieldOff, { className: "h-4 w-4 cursor-pointer hover:opacity-80", onClick: () => {
                            saveCase({
                                ...currentCase,
                                confidential: true,
                            });
                        } }, void 0)), (0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: (0, utils_1.cn)("m-0 uppercase transition-transform duration-100 scale-0 text-rose-500 select-none", currentCase.confidential && "scale-100"), children: t("Salainen") }, void 0)] }, void 0)), (0, jsx_runtime_1.jsx)(combocreate_1.ComboCreateCrime, { className: (0, utils_1.cn)("text-lg font-firasans uppercase tracking-tight font-medium w-64", currentCase.matter === "" && "border-rose-500"), value: currentCase.matter, onChange: (value) => {
                    saveCase({
                        ...currentCase,
                        matter: value,
                    });
                }, placeholder: t("Kirjoita tai valitse...") }, void 0)] }, void 0));
}
exports.Matter = Matter;
//# sourceMappingURL=Matter.js.map