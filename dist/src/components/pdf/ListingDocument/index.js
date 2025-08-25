"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingDocument = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const react_i18next_1 = require("react-i18next");
const date_fns_1 = require("date-fns");
const FiraSans_Regular_ttf_1 = __importDefault(require("@/fonts/Fira_Sans/FiraSans-Regular.ttf"));
const FiraSans_Bold_ttf_1 = __importDefault(require("@/fonts/Fira_Sans/FiraSans-Bold.ttf"));
const FiraSans_Italic_ttf_1 = __importDefault(require("@/fonts/Fira_Sans/FiraSans-Italic.ttf"));
const CaseView_1 = require("@/components/pdf/ListingDocument/CaseView");
const OfficerView_1 = require("@/components/pdf/ListingDocument/OfficerView");
renderer_1.Font.register({
    family: "Fira Sans",
    fonts: [
        { src: FiraSans_Regular_ttf_1.default },
        { src: FiraSans_Bold_ttf_1.default, fontWeight: "bold" },
        {
            src: FiraSans_Italic_ttf_1.default,
            fontStyle: "italic",
            fontWeight: "normal",
        },
    ],
});
renderer_1.Font.registerHyphenationCallback((word) => [word]);
const commonStyles = renderer_1.StyleSheet.create({
    section: {
        marginTop: 20,
        marginBottom: 20,
    },
});
const getOfficerCaseNumbers = (cases, type) => {
    const officerCases = [];
    for (let i = 0; i < cases.length; i++) {
        const currentCase = cases[i];
        const currentOfficers = currentCase.officers.filter((officer) => officer.type === type);
        for (let officer of currentOfficers) {
            const existingIndex = officerCases.findIndex((existing) => existing.officer.name === officer.name);
            if (existingIndex !== -1) {
                officerCases[existingIndex].cases.push(i + 1);
                continue;
            }
            officerCases.push({
                officer: officer,
                cases: [i + 1],
            });
        }
    }
    return officerCases;
};
const ListingDocument = ({ court, department, room, date, sessionBrake, cases, courtTitles, prosecutorTitles, laymanTitles, crimes, notes, notePublicity, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const presidingInfo = getOfficerCaseNumbers(cases, "presiding");
    const memberInfo = getOfficerCaseNumbers(cases, "member");
    const laymanInfo = getOfficerCaseNumbers(cases, "layman");
    const prosecutorInfo = getOfficerCaseNumbers(cases, "prosecutor");
    const secretaryInfo = getOfficerCaseNumbers(cases, "secretary");
    const styles = renderer_1.StyleSheet.create({
        page: {
            flexDirection: "column",
            gap: 2,
            fontFamily: "Fira Sans",
            fontSize: 14,
            paddingBottom: 40,
            paddingTop: 40,
            paddingLeft: 40,
            paddingRight: 40,
        },
        generalInfo: {
            ...commonStyles.section,
            flexDirection: "row",
            marginTop: 0,
        },
        courtDetails: {
            flexDirection: "column",
            width: "60%",
            marginRight: 20,
        },
        courtDetailMain: {
            textTransform: "uppercase",
            fontWeight: "bold",
        },
        titleAndDate: {
            flexDirection: "column",
        },
        notes: {
            width: "100%",
            marginBottom: 20,
            marginTop: 0,
        },
        notesText: {
            fontStyle: "italic",
        },
        partDivider: {
            borderTop: 1,
            marginHorizontal: 30,
        },
        break: {
            ...commonStyles.section,
            marginTop: 10,
        },
        breakText: {
            marginHorizontal: 30,
        },
        cases: {
            ...commonStyles.section,
            flexDirection: "column",
            gap: 30,
        },
    });
    return ((0, jsx_runtime_1.jsx)(renderer_1.Document, { children: (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.generalInfo, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.courtDetails, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.courtDetailMain, children: court.name }, void 0), department !== "" && (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: department }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: room }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.titleAndDate, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.courtDetailMain, children: t("Juttuluettelo") }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: (0, date_fns_1.format)(date, "dd.MM.yyyy") }, void 0)] }, void 0)] }, void 0), notePublicity === "public" && notes && ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.notes, children: (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.notesText, children: notes }, void 0) }, void 0)), (0, jsx_runtime_1.jsx)(OfficerView_1.OfficerView, { officerInfo: presidingInfo, presidingInfo: presidingInfo, titles: courtTitles, title: t("Oikeuden puheenjohtaja", "Oikeuden puheenjohtaja", {
                        count: presidingInfo.length,
                    }), caseCount: cases.length }, void 0), (0, jsx_runtime_1.jsx)(OfficerView_1.OfficerView, { officerInfo: memberInfo, presidingInfo: presidingInfo, titles: courtTitles, title: t("Jäsenet"), caseCount: cases.length }, void 0), (0, jsx_runtime_1.jsx)(OfficerView_1.OfficerView, { officerInfo: laymanInfo, presidingInfo: presidingInfo, titles: laymanTitles, title: t("Lautamiehet"), caseCount: cases.length }, void 0), (0, jsx_runtime_1.jsx)(OfficerView_1.OfficerView, { officerInfo: prosecutorInfo, presidingInfo: presidingInfo, titles: prosecutorTitles, title: t("Syyttäjä", "Syyttäjä", {
                        count: prosecutorInfo.length,
                    }), caseCount: cases.length }, void 0), (0, jsx_runtime_1.jsx)(OfficerView_1.OfficerView, { officerInfo: secretaryInfo, presidingInfo: presidingInfo, titles: courtTitles, title: t("Pöytäkirjanpitäjä", "Pöytäkirjanpitäjä", {
                        count: secretaryInfo.length,
                    }), caseCount: cases.length }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.partDivider }, void 0), sessionBrake && ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.break, children: (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.breakText, children: `${t("Tauko kello")} ${(0, date_fns_1.format)(sessionBrake, "HH:mm")}.` }, void 0) }, void 0)), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.cases, children: cases.map((casu, index) => ((0, jsx_runtime_1.jsx)(CaseView_1.CaseView, { currentCase: casu, index: index, crimes: crimes }, casu.id))) }, void 0)] }, void 0) }, void 0));
};
exports.ListingDocument = ListingDocument;
//# sourceMappingURL=index.js.map