"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficerItem = exports.OfficerList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const immer_1 = require("immer");
const rowcol_1 = require("@/components/ui/rowcol");
const badge_1 = require("@/components/ui/badge");
const OfficerSheet_1 = require("./OfficerSheet");
const useResources_1 = require("@/hooks/useResources");
const dataFormat_1 = require("@/lib/dataFormat");
const queries_1 = require("@/hooks/queries");
function OfficerList({ currentCase }) {
    const lang = (0, queries_1.useResolvedLanguage)();
    const sortedOfficers = (0, immer_1.produce)(currentCase.officers, (draft) => draft.sort((a, b) => (0, dataFormat_1.sortOfficers)(a, b, lang)));
    return ((0, jsx_runtime_1.jsx)(rowcol_1.Col, { className: "gap-2", children: sortedOfficers.map((officer) => ((0, jsx_runtime_1.jsx)(OfficerItem, { officer: officer, currentCase: currentCase }, officer.id))) }, void 0));
}
exports.OfficerList = OfficerList;
function OfficerItem({ officer, currentCase }) {
    const resources = (0, useResources_1.useResources)();
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: "gap-3", children: [(0, jsx_runtime_1.jsx)(rowcol_1.Col, { className: "w-12 items-end", children: resources.isSuccess && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: officer.type, className: "m-0 w-12 justify-center", children: resources.data.positionAbbreviations[`${officer.type}_abr`] ??
                        "???" }, void 0)) }, void 0), (0, jsx_runtime_1.jsx)(rowcol_1.Col, { children: (0, jsx_runtime_1.jsx)(OfficerSheet_1.OfficerSheet, { getOfficer: () => officer, currentCase: currentCase, children: (0, jsx_runtime_1.jsx)("div", { className: "cursor-pointer transition-all duration-200 hover:opacity-80 min-w-48 max-w-48 overflow-hidden text-nowrap text-ellipsis", children: officer.name }, void 0) }, void 0) }, void 0)] }, void 0));
}
exports.OfficerItem = OfficerItem;
//# sourceMappingURL=OfficerList.js.map