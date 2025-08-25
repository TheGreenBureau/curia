"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heading = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
function Heading(props) {
    const { children, className, level, ...rest } = props;
    const common = "mt-4 mb-0 font-bold font-dosis uppercase";
    const classes = () => {
        switch (level) {
            case "h1":
                return "text-4xl";
            case "h2":
                return "text-2xl";
            case "h3":
                return "text-xl";
            case "h4":
                return "text-l";
            default:
                return "text-sm";
        }
    };
    const Tag = level;
    return ((0, jsx_runtime_1.jsx)(Tag, { className: (0, utils_1.cn)(common, classes(), className), ...rest, children: children }, void 0));
}
exports.Heading = Heading;
//# sourceMappingURL=headings.js.map