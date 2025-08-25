"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skeleton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
function Skeleton({ className, ...props }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("animate-pulse rounded-md bg-muted", className), ...props }, void 0));
}
exports.Skeleton = Skeleton;
//# sourceMappingURL=skeleton.js.map