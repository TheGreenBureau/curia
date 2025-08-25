"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.People = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const queries_1 = require("@/hooks/queries");
const dataFormat_1 = require("@/lib/dataFormat");
const react_i18next_1 = require("react-i18next");
const Civilians_1 = require("./Civilians");
const Assembly_1 = require("./Assembly");
const CaseNotes_1 = require("./CaseNotes");
const renderer_1 = require("@react-pdf/renderer");
function People(props) {
    const { currentCase, sharedAssembly } = props;
    const lang = (0, queries_1.useResolvedLanguage)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const sortedOfficers = [...currentCase.officers].sort((a, b) => (0, dataFormat_1.sortOfficers)(a, b, lang));
    const sortedCivilians = [...currentCase.civilians].sort((a, b) => (0, dataFormat_1.sortCivilians)(a, b, lang));
    const defendants = sortedCivilians.filter((c) => c.type === "defendant");
    const injured = sortedCivilians.filter((c) => c.type === "injured");
    const witnesses = sortedCivilians.filter((c) => c.type === "witness" || c.type === "expert");
    const nodes = [];
    if (defendants.length > 0) {
        nodes.push({
            id: "defendants",
            node: ((0, jsx_runtime_1.jsx)(Civilians_1.Civilians, { civilians: defendants, ...props, children: t("Vastaaja", "Vastaajat", { count: defendants.length }) }, void 0)),
        });
    }
    if (injured.length > 0) {
        nodes.push({
            id: "injured",
            node: ((0, jsx_runtime_1.jsx)(Civilians_1.Civilians, { civilians: injured, ...props, children: t("Asianomistaja", "Asianomistajat", { count: injured.length }) }, void 0)),
        });
    }
    if (witnesses.length > 0) {
        nodes.push({
            id: "witnesses",
            node: ((0, jsx_runtime_1.jsx)(Civilians_1.Civilians, { civilians: witnesses, ...props, children: t("Todistaja", "Todistajat", { count: witnesses.length }) }, void 0)),
        });
    }
    if (sortedOfficers.length > 0 && !sharedAssembly) {
        nodes.push({
            id: "court",
            node: (0, jsx_runtime_1.jsx)(Assembly_1.Assembly, { sortedOfficers: sortedOfficers, ...props }, void 0),
        });
    }
    if (currentCase.notes &&
        (currentCase.notePublicity === "public" ||
            currentCase.notePublicity === "prosecutor")) {
        nodes.push({
            id: "notes",
            node: (0, jsx_runtime_1.jsx)(CaseNotes_1.CaseNotes, { notes: currentCase.notes }, void 0),
        });
    }
    const styles = renderer_1.StyleSheet.create({
        separator: {
            borderBottom: 1,
            marginRight: 10,
            marginVertical: 5,
        },
        finalMargin: {
            marginBottom: 5,
        },
    });
    return nodes.map((node, index) => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [node.node, index < nodes.length - 1 ? ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.separator }, void 0)) : ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.finalMargin }, void 0))] }, void 0)));
}
exports.People = People;
//# sourceMappingURL=People.js.map