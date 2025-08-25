"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_1 = require("@/lib/utils");
const clsx_1 = require("clsx");
function Link(props) {
    const { children, ...rest } = props;
    const [hover, setHover] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsx)("span", { className: "inline-block", onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), children: (0, jsx_runtime_1.jsxs)("span", { className: "w-fit pb-[2px] flex flex-col gap-[1px] items-center justify-center cursor-pointer", children: [(0, jsx_runtime_1.jsx)("a", { ...rest, className: (0, clsx_1.clsx)(rest.className, (0, utils_1.cn)("leading-4 text-sky-600 dark:text-cyan-500 no-underline transition-all duration-200", hover && "dark:text-amber-500")), children: (0, utils_1.getNodeText)(children) }, void 0), (0, jsx_runtime_1.jsx)("span", { className: (0, clsx_1.clsx)((0, utils_1.cn)("transition-all duration-200 w-0 border-t-transparent border-t", hover && "w-full border-t-amber-500")) }, void 0)] }, void 0) }, void 0));
}
exports.Link = Link;
//# sourceMappingURL=link.js.map