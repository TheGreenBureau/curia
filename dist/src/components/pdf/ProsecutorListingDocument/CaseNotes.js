"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseNotes = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const renderer_1 = require("@react-pdf/renderer");
const commonStyles_1 = require("./commonStyles");
function CaseNotes(props) {
    const { notes } = props;
    const { t } = (0, react_i18next_1.useTranslation)();
    const styles = renderer_1.StyleSheet.create({
        notes: {
            flexDirection: "row",
            gap: 10,
        },
        notesTitleText: {
            ...commonStyles_1.commonStyles.subtitle,
        },
        notesText: {
            flexWrap: "wrap",
            fontSize: 12,
            maxWidth: 400,
        },
    });
    return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.notes, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.notesTitleText, children: t("Huomioita") }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.notesText, children: notes }, void 0)] }, void 0));
}
exports.CaseNotes = CaseNotes;
//# sourceMappingURL=CaseNotes.js.map