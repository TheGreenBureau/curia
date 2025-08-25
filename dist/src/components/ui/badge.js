"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeVariants = exports.Badge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const class_variance_authority_1 = require("class-variance-authority");
const utils_1 = require("@/lib/utils");
const badgeVariants = (0, class_variance_authority_1.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-sy-03 dark:hover:text-cyan-300 dark:hover:bg-primary",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            outline: "text-foreground",
            presiding: "border-teal-600 text-foreground dark:border-teal-400 dark:text-teal-400",
            secretary: "border-amber-600 text-foreground dark:border-amber-400 dark:text-amber-400",
            member: "border-sky-600 text-foreground dark:border-sky-400 dark:text-sky-400",
            layman: "border-pink-600 text-foreground dark:border-pink-400 dark:text-pink-400",
            prosecutor: "border-purple-600 text-foreground dark:border-purple-400 dark:text-purple-400",
            defendant: "border-rose-600 text-foreground dark:border-rose-400 dark:text-rose-400",
            plaintiff: "border-lime-600 text-foreground dark:border-lime-400 dark:text-lime-400",
            injured: "border-lime-600 text-foreground dark:border-lime-400 dark:text-lime-400",
            witness: "border-fuchsia-600 text-foreground dark:border-fuchsia-400 dark:text-fuchsia-400",
            expert: "border-orange-600 text-foreground dark:border-orange-400 dark:text-orange-400",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
exports.badgeVariants = badgeVariants;
function Badge({ className, variant, ...props }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)(badgeVariants({ variant }), className), ...props }, void 0));
}
exports.Badge = Badge;
//# sourceMappingURL=badge.js.map