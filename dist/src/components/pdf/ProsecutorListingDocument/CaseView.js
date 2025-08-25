"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseView = exports.filterOfficerType = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const queries_1 = require("@/hooks/queries");
const People_1 = require("./People");
const renderer_1 = require("@react-pdf/renderer");
const date_fns_1 = require("date-fns");
const dataFormat_1 = require("@/lib/dataFormat");
const filterOfficerType = (officers, type) => {
    return officers.filter((o) => o.type === type);
};
exports.filterOfficerType = filterOfficerType;
function CaseView(props) {
    const { currentCase, index, crimes, sharedProsecutors } = props;
    const lang = (0, queries_1.useResolvedLanguage)();
    const styles = renderer_1.StyleSheet.create({
        caseView: {
            flexDirection: "column",
            paddingBottom: 5,
            gap: 5,
            border: 1,
            borderTop: 5,
            borderRadius: 5,
        },
        caseInfo: {
            flexDirection: "column",
            marginHorizontal: 10,
            maxWidth: 510,
            gap: 5,
            position: "relative",
        },
        serialAndMatter: {
            flexDirection: "row",
            maxWidth: 560,
            marginTop: 10,
            fontWeight: "medium",
        },
        serialText: {
            width: 20,
        },
        matterText: {
            textTransform: "uppercase",
            fontWeight: "medium",
            maxWidth: 450,
            flexWrap: "wrap",
        },
        timeAndCaseNumbers: {
            flexDirection: "row",
            maxWidth: 560,
            gap: 10,
            alignItems: "center",
            marginTop: 5,
        },
        time: {
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
        },
        timeText: {
            fontWeight: "medium",
        },
        prosecutorCaseNumberText: {
            fontWeight: "medium",
        },
        separator: {
            borderBottom: 1,
            marginHorizontal: 10,
        },
        people: {
            flexDirection: "column",
            marginLeft: 10,
        },
    });
    return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.caseView, wrap: false, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.caseInfo, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.serialAndMatter, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.serialText, children: [index + 1, "."] }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.matterText, children: crimes.find((o) => o.value === currentCase.matter)?.label ??
                                    currentCase.matter }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.timeAndCaseNumbers, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.time, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Svg, { style: { marginTop: 1 }, width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", children: [(0, jsx_runtime_1.jsx)(renderer_1.Circle, { cx: "12", cy: "12", r: "10", fill: "none", stroke: "black", strokeWidth: "2" }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Polyline, { points: "12 6 12 12 16 14", fill: "none", strokeWidth: "2" }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.timeText, children: (0, date_fns_1.format)(currentCase.time, "HH:mm") }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: "|" }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.prosecutorCaseNumberText, children: currentCase.prosecutorCaseNumber }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: "|" }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: currentCase.caseNumber }, void 0), !sharedProsecutors && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { children: "|" }, void 0), (0, exports.filterOfficerType)(currentCase.officers, "prosecutor")
                                        .sort((a, b) => (0, dataFormat_1.sortOfficers)(a, b, lang))
                                        .map((prosecutor) => ((0, jsx_runtime_1.jsx)(renderer_1.Text, { children: prosecutor.name }, void 0)))] }, void 0))] }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.separator }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.people, children: (0, jsx_runtime_1.jsx)(People_1.People, { ...props }, void 0) }, void 0)] }, void 0));
}
exports.CaseView = CaseView;
//# sourceMappingURL=CaseView.js.map