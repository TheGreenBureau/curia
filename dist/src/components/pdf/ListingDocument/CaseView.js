"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseView = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const renderer_1 = require("@react-pdf/renderer");
const date_fns_1 = require("date-fns");
const getCrimeTranslation = (value, crimes) => {
    return crimes.find((c) => c.value === value)?.label ?? value;
};
function CaseView({ currentCase, index, crimes }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const prosecutorCount = currentCase.officers.filter((o) => o.type === "prosecutor").length;
    const plaintiffs = currentCase.civilians.filter((c) => c.type === "plaintiff");
    const styles = renderer_1.StyleSheet.create({
        case: {
            flexDirection: "column",
        },
        basicInfo: {
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-start",
        },
        serialText: {
            width: "7%",
        },
        timeAndConfidentiality: {
            width: "14%",
            maxWidth: "15%",
            flexDirection: "column",
        },
        confidentialityText: {
            marginTop: 5,
        },
        caseNumbersAndPeople: {
            flexDirection: "column",
            width: "40%",
            maxWidth: "40%",
        },
        caseNumbers: {
            flexDirection: "row",
            maxWidth: "100%",
            flexWrap: "wrap",
        },
        caseNumberText: {
            minWidth: "18%",
            marginRight: 10,
        },
        prosecutors: {
            flexDirection: "column",
            marginTop: 5,
        },
        personText: {
            textTransform: "uppercase",
        },
        defendants: {
            flexDirection: "row",
            maxWidth: "100%",
            flexWrap: "wrap",
        },
        matter: {
            width: "38%",
            maxWidth: "38%",
        },
        notes: {
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-start",
            marginTop: 10,
            marginBottom: 0,
        },
        notesText: {
            fontStyle: "italic",
            fontSize: 12,
            paddingTop: 5,
        },
    });
    return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.case, wrap: false, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.basicInfo, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.serialText, children: [index + 1, "."] }, void 0), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.timeAndConfidentiality, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { children: (0, date_fns_1.format)(currentCase.time, "HH:mm") }, void 0), currentCase.confidential && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.confidentialityText, children: t("Salainen") }, void 0))] }, void 0), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.caseNumbersAndPeople, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.caseNumbers, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.caseNumberText, children: currentCase.caseNumber }, void 0), currentCase.type === "criminal" && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { children: `(${currentCase.prosecutorCaseNumber})` }, void 0))] }, void 0), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.prosecutors, children: [prosecutorCount > 0 && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.personText, children: `${t("strings:Syyttäjä", "Syyttäjä", { count: prosecutorCount })}/` }, void 0)), plaintiffs.length > 0 &&
                                        plaintiffs.map((plaintiff) => ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.personText, children: `${plaintiff.name}/` }, plaintiff.id))), currentCase.civilians
                                        .filter((c) => c.type === "defendant")
                                        .map((defendant) => ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.defendants, children: (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.personText, children: defendant.name.trim() }, defendant.id) }, defendant.id)))] }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.matter, children: getCrimeTranslation(currentCase.matter, crimes).toUpperCase() }, void 0)] }, void 0), currentCase.notePublicity === "public" && currentCase.notes && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.notes, children: [(0, jsx_runtime_1.jsx)(renderer_1.View, { style: { width: "7%" } }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: { width: "13%" } }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.notesText, children: currentCase.notes }, void 0)] }, void 0))] }, void 0));
}
exports.CaseView = CaseView;
//# sourceMappingURL=CaseView.js.map