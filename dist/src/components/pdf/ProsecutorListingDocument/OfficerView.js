"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficerView = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
function OfficerView(props) {
    const { officer, laymanTitles, courtTitles, positionAbbreviations } = props;
    const getTitle = () => {
        switch (officer.type) {
            case "layman":
                return (laymanTitles.find((title) => officer.title === title.value)?.label ??
                    officer.title);
            default:
                return (courtTitles.find((title) => officer.title === title.value)?.label ??
                    officer.title);
        }
    };
    const styles = renderer_1.StyleSheet.create({
        officer: {
            flexDirection: "column",
            maxWidth: 220,
        },
        officerNameText: {
            flexWrap: "wrap",
            maxWidth: 220,
        },
        positionAndTitle: {
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
        },
        positionText: {
            fontWeight: officer.type === "presiding" ? "bold" : "normal",
            fontSize: 10,
        },
        titleText: {
            fontStyle: "italic",
            fontSize: 12,
        },
    });
    return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.officer, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.officerNameText, children: officer.name.trim() }, void 0), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.positionAndTitle, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.positionText, children: `(${positionAbbreviations[`${officer.type}_abr`] ?? "???"})` }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.titleText, children: getTitle() }, void 0)] }, void 0)] }, void 0));
}
exports.OfficerView = OfficerView;
//# sourceMappingURL=OfficerView.js.map