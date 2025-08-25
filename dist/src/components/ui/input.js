"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
const Input = React.forwardRef(({ className, type, onClear, ...props }, ref) => {
    const [hasFocus, setHasFocus] = React.useState(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)(className, "relative"), children: [(0, jsx_runtime_1.jsx)("input", { type: type, className: (0, utils_1.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", onClear && "pr-8", className), ref: ref, ...props, onFocus: (e) => {
                    setHasFocus(true);
                    if (props.onFocus) {
                        props.onFocus(e);
                    }
                }, onBlur: (e) => {
                    setHasFocus(false);
                    if (props.onBlur) {
                        props.onBlur(e);
                    }
                } }, void 0), onClear && ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex justify-center items-center scale-0 transition-all duration-200 cursor-pointer hover:opacity-75", hasFocus && "scale-100"), onClick: (e) => {
                    e.preventDefault();
                    onClear();
                }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }, void 0) }, void 0))] }, void 0));
});
exports.Input = Input;
Input.displayName = "Input";
//# sourceMappingURL=input.js.map