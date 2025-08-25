"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Civilians = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const commonStyles_1 = require("./commonStyles");
const CivilianView_1 = require("./CivilianView");
function Civilians(props) {
    const { children, civilians, ...rest } = props;
    const styles = renderer_1.StyleSheet.create({
        civilians: {
            flexDirection: "row",
            gap: 10,
        },
        civiliansTitleText: {
            ...commonStyles_1.commonStyles.subtitle,
        },
        civiliansList: {
            flexDirection: "row",
            gap: 20,
            flexWrap: "wrap",
        },
    });
    return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.civilians, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.civiliansTitleText, children: children }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.civiliansList, children: civilians.map((civilian) => ((0, jsx_runtime_1.jsx)(CivilianView_1.CivilianView, { civilian: civilian, ...rest }, civilian.id))) }, void 0)] }, void 0));
}
exports.Civilians = Civilians;
//# sourceMappingURL=Civilians.js.map