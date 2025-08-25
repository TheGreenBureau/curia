"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = exports.Col = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
function Col(props) {
    const { children, className, ...rest } = props;
    return ((0, jsx_runtime_1.jsx)("div", { ...rest, className: (0, utils_1.cn)("flex flex-col gap-4 items-start", className), children: children }, void 0));
}
exports.Col = Col;
function Row(props) {
    const { children, className, ...rest } = props;
    return ((0, jsx_runtime_1.jsx)("div", { ...rest, className: (0, utils_1.cn)("flex flex-row gap-4 items-start", className), children: children }, void 0));
}
exports.Row = Row;
//# sourceMappingURL=rowcol.js.map