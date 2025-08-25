"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notes = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const headings_1 = require("@/components/ui/headings");
const rowcol_1 = require("@/components/ui/rowcol");
const textarea_1 = require("@/components/ui/textarea");
const case_1 = require("@/types/data/case");
const react_i18next_1 = require("react-i18next");
const PublicityButton_1 = require("@/components/Pages/Listing/PublicityButton");
function Notes({ className, heading, currentCase, updateCase, saveCase, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const publicityStatus = currentCase.notePublicity ?? "private";
    const onPublicityClick = () => {
        const pubIndex = case_1.notePublicityTypes.indexOf(publicityStatus);
        if (pubIndex === -1 || pubIndex === case_1.notePublicityTypes.length - 1) {
            saveCase({
                ...currentCase,
                notePublicity: "private",
            });
            return;
        }
        saveCase({
            ...currentCase,
            notePublicity: case_1.notePublicityTypes[pubIndex + 1],
        });
    };
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Col, { className: className, children: [(0, jsx_runtime_1.jsxs)(rowcol_1.Row, { children: [heading && ((0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "m-0 select-none", children: heading }, void 0)), (0, jsx_runtime_1.jsx)(PublicityButton_1.PublicityButton, { publicity: publicityStatus, onClick: onPublicityClick }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { value: currentCase.notes, onChange: (e) => updateCase({
                    ...currentCase,
                    notes: e.target.value,
                }), onBlur: () => saveCase() }, void 0)] }, void 0));
}
exports.Notes = Notes;
//# sourceMappingURL=Notes.js.map