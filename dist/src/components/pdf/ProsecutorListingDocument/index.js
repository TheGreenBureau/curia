"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProsecutorListingDocument = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const react_i18next_1 = require("react-i18next");
const date_fns_1 = require("date-fns");
const FiraSans_Regular_ttf_1 = __importDefault(require("@/fonts/Fira_Sans/FiraSans-Regular.ttf"));
const FiraSans_Bold_ttf_1 = __importDefault(require("@/fonts/Fira_Sans/FiraSans-Bold.ttf"));
const FiraSans_Italic_ttf_1 = __importDefault(require("@/fonts/Fira_Sans/FiraSans-Italic.ttf"));
const FiraSans_SemiBold_ttf_1 = __importDefault(require("@/fonts/Fira_Sans/FiraSans-SemiBold.ttf"));
const FiraSans_Medium_ttf_1 = __importDefault(require("@/fonts/Fira_Sans/FiraSans-Medium.ttf"));
const persons_1 = require("@/types/data/persons");
const dataFormat_1 = require("@/lib/dataFormat");
const queries_1 = require("@/hooks/queries");
const Assembly_1 = require("./Assembly");
const CaseView_1 = require("./CaseView");
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
        { src: FiraSans_SemiBold_ttf_1.default, fontWeight: "semibold" },
        { src: FiraSans_Medium_ttf_1.default, fontWeight: "medium" },
    ],
});
renderer_1.Font.registerHyphenationCallback((word) => [word]);
const officerArraysEqual = (a, b, lang) => {
    if (a.length !== b.length)
        return false;
    const sortedA = [...a].sort((a, b) => (0, dataFormat_1.sortOfficers)(a, b, lang));
    const sortedB = [...b].sort((a, b) => (0, dataFormat_1.sortOfficers)(a, b, lang));
    for (let i = 0; i < sortedA.length; i++) {
        if (sortedA[i].name !== sortedB[i].name) {
            return false;
        }
    }
    return true;
};
function ProsecutorListingDocument(props) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const lang = (0, queries_1.useResolvedLanguage)();
    const { cases, court, date, department, room, notes, notePublicity } = props;
    const getProsecutors = () => {
        const prosecutors = [];
        for (let c of cases) {
            const caseProsecutors = (0, CaseView_1.filterOfficerType)(c.officers, "prosecutor");
            for (let caseProsecutor of caseProsecutors) {
                if (!prosecutors.includes(caseProsecutor.name)) {
                    prosecutors.push(caseProsecutor.name);
                }
            }
        }
        return prosecutors;
    };
    const getHasSharedOfficers = () => {
        if (cases.length === 0)
            return {
                court: false,
                prosecutors: false,
            };
        let court = true;
        let prosecutors = true;
        const officers = persons_1.officerTypes.reduce((prev, next) => {
            return {
                ...prev,
                [next]: (0, CaseView_1.filterOfficerType)(cases[0].officers, next),
            };
        }, {});
        for (let i = 1; i < cases.length; i++) {
            const current = cases[i];
            for (let key of persons_1.officerTypes.filter((t) => t !== "prosecutor")) {
                if (!officerArraysEqual((0, CaseView_1.filterOfficerType)(current.officers, key), officers[key], lang)) {
                    court = false;
                }
            }
            for (let key of persons_1.officerTypes.filter((t) => t === "prosecutor")) {
                if (!officerArraysEqual((0, CaseView_1.filterOfficerType)(current.officers, key), officers[key], lang)) {
                    prosecutors = false;
                }
            }
        }
        return { court, prosecutors };
    };
    const prosecutors = getProsecutors();
    const hasSharedOfficers = getHasSharedOfficers();
    const sharedAssembly = hasSharedOfficers.court;
    const sharedProsecutors = hasSharedOfficers.prosecutors;
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
        listingInfo: {
            flexDirection: "row",
        },
        courtInfo: {
            width: "60%",
            flexDirection: "column",
        },
        titleAndDate: {
            flexDirection: "row",
            gap: 5,
            fontWeight: "bold",
            textTransform: "uppercase",
        },
        prosecutors: {
            flexDirection: "column",
        },
        prosecutorsTitleText: {
            fontWeight: "bold",
            textTransform: "uppercase",
        },
        notes: {
            marginTop: 20,
        },
        notesText: {
            fontStyle: "italic",
        },
        sharedAssembly: {
            marginTop: 20,
        },
        cases: {
            flexDirection: "column",
            gap: 20,
            marginTop: 30,
            marginBottom: 20,
        },
    });
    return ((0, jsx_runtime_1.jsx)(renderer_1.Document, { children: (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listingInfo, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.courtInfo, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.titleAndDate, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { children: t("Juttuluettelo") }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: (0, date_fns_1.format)(date, "dd.MM.yyyy") }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: court.name }, void 0), department !== "" && (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: department }, void 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { children: room }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.prosecutors, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.prosecutorsTitleText, children: t("Syyttäjä", "Syyttäjä", { count: prosecutors.length }) }, void 0), prosecutors.map((prosecutor) => ((0, jsx_runtime_1.jsx)(renderer_1.Text, { children: prosecutor }, prosecutor)))] }, void 0)] }, void 0), notes &&
                    (notePublicity === "public" || notePublicity === "prosecutor") && ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.notes, children: (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.notesText, children: notes }, void 0) }, void 0)), sharedAssembly && ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.sharedAssembly, children: (0, jsx_runtime_1.jsx)(Assembly_1.Assembly, { sortedOfficers: [...cases[0].officers].sort((a, b) => (0, dataFormat_1.sortOfficers)(a, b, lang)), ...props }, void 0) }, void 0)), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.cases, children: cases.map((current, index) => ((0, jsx_runtime_1.jsx)(CaseView_1.CaseView, { currentCase: current, index: index, sharedAssembly: sharedAssembly, ...props, sharedProsecutors: sharedProsecutors }, current.id))) }, void 0)] }, void 0) }, void 0));
}
exports.ProsecutorListingDocument = ProsecutorListingDocument;
//# sourceMappingURL=index.js.map