"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CivilianItem = exports.CivilianList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const immer_1 = require("immer");
const rowcol_1 = require("@/components/ui/rowcol");
const badge_1 = require("@/components/ui/badge");
const CivilianSheet_1 = require("@/components/Pages/Listing/Item/Civilians/CivilianSheet");
const useResources_1 = require("@/hooks/useResources");
const dataFormat_1 = require("@/lib/dataFormat");
const queries_1 = require("@/hooks/queries");
function CivilianList({ currentCase }) {
    const lang = (0, queries_1.useResolvedLanguage)();
    const sortedCivilians = (0, immer_1.produce)(currentCase.civilians, (draft) => draft.sort((a, b) => (0, dataFormat_1.sortCivilians)(a, b, lang)));
    return ((0, jsx_runtime_1.jsx)(rowcol_1.Col, { className: "gap-2", children: sortedCivilians.map((civilian) => ((0, jsx_runtime_1.jsx)(CivilianItem, { civilian: civilian, currentCase: currentCase }, civilian.id))) }, void 0));
}
exports.CivilianList = CivilianList;
function CivilianItem({ civilian, currentCase }) {
    const resources = (0, useResources_1.useResources)();
    return ((0, jsx_runtime_1.jsxs)(rowcol_1.Row, { className: "gap-3", children: [(0, jsx_runtime_1.jsx)(rowcol_1.Col, { className: "w-12 items-end", children: resources.isSuccess && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: civilian.type, className: "m-0 w-12 justify-center", children: resources.data.positionAbbreviations[`${civilian.type}_abr`] ??
                        "???" }, void 0)) }, void 0), (0, jsx_runtime_1.jsx)(rowcol_1.Col, { children: (0, jsx_runtime_1.jsx)(CivilianSheet_1.CivilianSheet, { getCivilian: () => civilian, currentCase: currentCase, children: (0, jsx_runtime_1.jsx)("div", { className: "cursor-pointer transition-all duration-200 hover:opacity-80 min-w-48 max-w-48 overflow-hidden text-nowrap text-ellipsis", children: civilian.name }, void 0) }, void 0) }, void 0)] }, void 0));
}
exports.CivilianItem = CivilianItem;
//# sourceMappingURL=CivilianList.js.map