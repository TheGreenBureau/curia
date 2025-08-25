"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const rowcol_1 = require("@/components/ui/rowcol");
const headings_1 = require("@/components/ui/headings");
const date_time_picker_1 = require("@/components/ui/date-time-picker");
function Time({ className, heading, currentCase, saveCase }) {
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Col, { className: className, children: [heading && ((0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "m-0", children: heading }, void 0)), (0, jsx_runtime_1.jsx)(date_time_picker_1.TimePicker, { date: currentCase.time, onChange: (date) => {
                    saveCase({
                        ...currentCase,
                        time: date ?? currentCase.time,
                    });
                }, granularity: "minute" }, void 0)] }, void 0));
}
exports.Time = Time;
//# sourceMappingURL=Time.js.map