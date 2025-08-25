"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseNumbers = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const rowcol_1 = require("@/components/ui/rowcol");
const headings_1 = require("@/components/ui/headings");
const label_1 = require("@/components/ui/label");
const input_1 = require("@/components/ui/input");
const utils_1 = require("@/lib/utils");
const react_i18next_1 = require("react-i18next");
function CaseNumbers({ className, heading, currentCase, updateCase, saveCase, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Col, { className: className, children: [heading && ((0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "m-0", children: heading }, void 0)), (0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: "items-center", children: [currentCase.type === "criminal" && ((0, jsx_runtime_1.jsx)(label_1.Label, { className: "w-5 text-right", children: t("TI") }, void 0)), (0, jsx_runtime_1.jsx)(input_1.Input, { className: (0, utils_1.cn)("text-base transition-all duration-200 outline-none text-ellipsis w-52", currentCase.caseNumber === "" && "border-rose-500", currentCase.type === "civil" && "w-[15.25rem]"), value: currentCase.caseNumber, onChange: (e) => updateCase({
                            ...currentCase,
                            caseNumber: e.target.value,
                        }), onClear: () => updateCase({
                            ...currentCase,
                            caseNumber: "",
                        }), onBlur: () => saveCase() }, void 0)] }, void 0), currentCase.type === "criminal" && ((0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: "items-center", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "w-5 text-right", children: t("SJÄ") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { className: (0, utils_1.cn)("text-muted-foreground text-base transition-all duration-200 outline-none text-ellipsis w-52", currentCase.prosecutorCaseNumber === "" && "border-rose-500"), value: currentCase.prosecutorCaseNumber, onChange: (e) => updateCase({
                            ...currentCase,
                            prosecutorCaseNumber: e.target.value,
                        }), onClear: () => updateCase({
                            ...currentCase,
                            prosecutorCaseNumber: "",
                        }), onBlur: () => saveCase() }, void 0)] }, void 0))] }, void 0));
}
exports.CaseNumbers = CaseNumbers;
//# sourceMappingURL=CaseNumbers.js.map