"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficerView = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const renderer_1 = require("@react-pdf/renderer");
const OfficerCaseLine = ({ info }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getText = () => {
        return `${t("strings:Asiassa", "Asiassa", {
            count: info.cases.length,
        })} ${info.cases.join(", ")}`;
    };
    return (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: getText() }, void 0);
};
function OfficerView({ officerInfo, presidingInfo, titles, title, caseCount, }) {
    const styles = renderer_1.StyleSheet.create({
        officerInfo: {
            marginBottom: 20,
            flexDirection: "row",
            marginTop: 5,
        },
        titleText: {
            width: "25%",
            marginRight: 60,
        },
        officers: {
            flexDirection: "column",
            gap: 10,
        },
        nameTitleAndCases: {
            flexDirection: "column",
        },
        officerTitleText: {
            fontStyle: "italic",
        },
    });
    if (officerInfo.length > 0) {
        return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.officerInfo, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.titleText, children: title }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.officers, children: officerInfo.map((info) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.nameTitleAndCases, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { children: info.officer.name }, void 0), info.officer.title !== "juror" && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.officerTitleText, children: titles.find((title) => title.value === info.officer.title)
                                    ?.label ?? info.officer.title }, void 0)), caseCount > 1 &&
                                (info.officer.type === "member" ||
                                    info.officer.type === "layman" ||
                                    officerInfo.length > 1 ||
                                    presidingInfo.length > 1) && (0, jsx_runtime_1.jsx)(OfficerCaseLine, { info: info }, void 0)] }, info.officer.id))) }, void 0)] }, void 0));
    }
    return null;
}
exports.OfficerView = OfficerView;
//# sourceMappingURL=OfficerView.js.map