"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const button_1 = require("@/components/ui/button");
const headings_1 = require("@/components/ui/headings");
const separator_1 = require("@/components/ui/separator");
const mutations_1 = require("@/hooks/mutations");
const queries_1 = require("@/hooks/queries");
const useResources_1 = require("@/hooks/useResources");
const useStore_1 = require("@/hooks/useStore");
const utils_1 = require("@/lib/utils");
const date_fns_1 = require("date-fns");
const lucide_react_1 = require("lucide-react");
const SessionEditSheet_1 = require("./SessionEditSheet");
const react_1 = require("react");
const alert_1 = require("@/components/ui/alert");
const react_i18next_1 = require("react-i18next");
const CaseSheet_1 = require("./CaseSheet");
const CaseList_1 = require("./CaseList");
const ListingMenu_1 = require("@/components/Pages/Listing/ListingMenu");
const dataFormat_1 = require("@/lib/dataFormat");
const react_2 = require("@gsap/react");
const gsap_1 = require("gsap");
const createNewCase = (defaults) => {
    const date = new Date();
    date.setHours(9, 0, 0);
    const officers = [];
    if (defaults?.presiding) {
        officers.push(defaults.presiding);
    }
    if (defaults?.secretary) {
        officers.push(defaults.secretary);
    }
    return {
        id: "",
        caseNumber: "",
        prosecutorCaseNumber: "",
        matter: "",
        time: date,
        type: "criminal",
        officers: officers,
        civilians: [],
    };
};
function Listing() {
    const [caseSheetOpen, setCaseSheetOpen] = (0, react_1.useState)(false);
    const currentListing = (0, useStore_1.useStore)((state) => state.currentListing);
    const setCurrentListing = (0, useStore_1.useStore)((state) => state.setCurrentListing);
    const resources = (0, useResources_1.useResources)();
    const crimes = (0, queries_1.useCrimes)();
    const openCSV = (0, mutations_1.useMutateOpenCSV)();
    const setMountDirection = (0, useStore_1.useStore)((state) => state.setMountDirection);
    const setShowSettings = (0, useStore_1.useStore)((state) => state.setShowSettings);
    const view = (0, useStore_1.useStore)((state) => state.welcomeView);
    const setView = (0, useStore_1.useStore)((state) => state.setWelcomeView);
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        setMountDirection("left");
        setShowSettings(false);
        if (view === undefined) {
            setView("initial");
        }
    }, []);
    const container = (0, react_1.useRef)(null);
    (0, react_2.useGSAP)(() => {
        gsap_1.gsap.to(container.current, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut",
        });
    }, { dependencies: [view], scope: container });
    if (currentListing && resources.isSuccess) {
        const court = resources.data.courts.find((c) => c.id === currentListing.court);
        const department = court?.departments.find((d) => d.id === currentListing.department);
        const office = court?.offices.find((o) => o.id === currentListing.office);
        const room = office?.rooms.find((r) => r.id === currentListing.room);
        const titles = {
            court: (0, dataFormat_1.optionsFromRecord)(resources.data.courtTitles),
            prosecutor: (0, dataFormat_1.optionsFromRecord)(resources.data.prosecutorTitles),
            layman: (0, dataFormat_1.optionsFromRecord)(resources.data.laymanTitles),
        };
        return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex flex-col px-8 py-10 gap-4 translate-x-[100px] opacity-0"), ref: container, children: [(0, jsx_runtime_1.jsx)(CaseSheet_1.CaseSheet, { getCase: () => createNewCase(), open: caseSheetOpen, onOpenChange: (open) => setCaseSheetOpen(open) }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row w-full", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", className: "rounded-full mr-4", onClick: () => setCurrentListing(null), children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-6 w-6" }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row gap-4 items-center w-full", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h2", className: "mt-0", children: court?.name ?? t("Tuntematon") }, void 0), (0, jsx_runtime_1.jsx)(SessionEditSheet_1.SessionEditSheet, { getListing: () => {
                                                return { ...currentListing };
                                            } }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row gap-4 items-center w-full flex-1", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "mt-0", children: (0, date_fns_1.format)(currentListing.date, "dd.MM.yyyy") }, void 0), department && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(separator_1.Separator, { orientation: "vertical", className: "h-8" }, void 0), (0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "mt-0", children: department.name }, void 0)] }, void 0)), room && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(separator_1.Separator, { orientation: "vertical", className: "h-8" }, void 0), (0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "mt-0", children: room.name }, void 0)] }, void 0)), currentListing.cases.length > 0 &&
                                            resources.isSuccess &&
                                            crimes.isSuccess &&
                                            court && ((0, jsx_runtime_1.jsx)(ListingMenu_1.ListingMenu, { listing: currentListing, onOpenCaseSheet: () => setCaseSheetOpen(true), court: court, office: office ?? null, department: department?.name ?? "", room: room?.name ?? "", date: currentListing.date, cases: currentListing.cases, courtTitles: titles.court, prosecutorTitles: titles.prosecutor, laymanTitles: titles.layman, sessionBrake: currentListing.break, crimes: crimes.data, notes: currentListing.notes, notePublicity: currentListing.notePublicity, positionAbbreviations: resources.data.positionAbbreviations, civilianPositions: (0, dataFormat_1.optionsFromRecord)(resources.data.civilianPositions), summons: (0, dataFormat_1.optionsFromRecord)(resources.data.summons), summonsStatus: (0, dataFormat_1.optionsFromRecord)(resources.data.summonsStatus) }, void 0))] }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}, void 0), currentListing.cases.length === 0 ? ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CircleSlash2, { className: "h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertTitle, { children: t("Ei juttuja") }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { className: "text-muted-foreground flex flex-row gap-4 items-center", children: t("Juttuluettelo on toistaiseksi tyhjä.") }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row gap-4 mt-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: () => setCaseSheetOpen(true), children: t("Uusi juttu") }, void 0), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: () => openCSV.mutate({ type: "criminal", currentListing }), children: t("Tuo CSV") }, void 0)] }, void 0)] }, void 0)) : ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(CaseList_1.CaseList, {}, void 0) }, void 0))] }, void 0));
    }
}
exports.Listing = Listing;
//# sourceMappingURL=index.js.map