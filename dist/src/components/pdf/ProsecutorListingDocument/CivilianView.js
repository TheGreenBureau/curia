"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CivilianView = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const react_i18next_1 = require("react-i18next");
function SummonsLine({ civilian, summons, summonsStatus }) {
    const getSummon = () => {
        return summons.find((summon) => summon.value === civilian.summonsType)
            ?.label;
    };
    const getStatus = () => {
        const text = summonsStatus.find((status) => status.value === civilian.summonsStatus)
            ?.label ?? "???";
        let color;
        switch (civilian.summonsStatus) {
            case "failure":
                color = "#e11d48";
                break;
            case "success":
                color = "black";
                break;
            case "fetch":
            case "warrant":
                color = "#f97316";
                break;
            default:
                color = "white";
        }
        return { text, color };
    };
    const summon = getSummon();
    const status = getStatus();
    const styles = renderer_1.StyleSheet.create({
        summonsLine: {
            flexDirection: "row",
            gap: 3,
            fontStyle: "italic",
            fontSize: 10,
        },
        summonsText: {
            color: status.color,
            fontStyle: "normal",
            fontWeight: "bold",
        },
    });
    return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.summonsLine, children: [summon && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { children: summon }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: "=>" }, void 0)] }, void 0)), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.summonsText, children: status.text }, void 0)] }, void 0));
}
function CivilianView(props) {
    const { civilian } = props;
    const { t } = (0, react_i18next_1.useTranslation)();
    const styles = renderer_1.StyleSheet.create({
        civilian: {
            flexDirection: "column",
            maxWidth: 220,
        },
        nameText: {
            flexWrap: "wrap",
        },
        civilianText: {
            fontSize: 10,
            fontStyle: "italic",
        },
    });
    return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.civilian, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.nameText, children: civilian.name.trim() }, void 0), (civilian.summonsType || civilian.summonsStatus) && ((0, jsx_runtime_1.jsx)(SummonsLine, { ...props }, void 0)), civilian.hasDemands && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.civilianText, children: t("Korvausvaatimus") }, void 0)), civilian.counselor && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.civilianText, children: `${t("Avustaja")} ${civilian.counselor}` }, void 0)), civilian.representative && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.civilianText, children: `${t("Edustaja")} ${civilian.representative}` }, void 0)), civilian.trustee && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.civilianText, children: `${t("Edunvalvoja")} ${civilian.trustee}` }, void 0))] }, void 0));
}
exports.CivilianView = CivilianView;
//# sourceMappingURL=CivilianView.js.map