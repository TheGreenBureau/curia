"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembly = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const renderer_1 = require("@react-pdf/renderer");
const commonStyles_1 = require("@/components/pdf/ProsecutorListingDocument/commonStyles");
const OfficerView_1 = require("./OfficerView");
function Assembly(props) {
    const { sortedOfficers, ...rest } = props;
    const { t } = (0, react_i18next_1.useTranslation)();
    const sortedCourt = sortedOfficers.filter((o) => o.type !== "prosecutor");
    const styles = renderer_1.StyleSheet.create({
        assembly: {
            flexDirection: "row",
            gap: 10,
        },
        assemblyTitleText: {
            ...commonStyles_1.commonStyles.subtitle,
        },
        assemblyOfficers: {
            flexDirection: "row",
            rowGap: 5,
            columnGap: 20,
            flexWrap: "wrap",
            maxWidth: 400,
        },
    });
    return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.assembly, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.assemblyTitleText, children: t("Tuomioistuin") }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.assemblyOfficers, children: sortedCourt.map((officer) => ((0, jsx_runtime_1.jsx)(OfficerView_1.OfficerView, { officer: officer, ...rest }, officer.id))) }, void 0)] }, void 0));
}
exports.Assembly = Assembly;
//# sourceMappingURL=Assembly.js.map