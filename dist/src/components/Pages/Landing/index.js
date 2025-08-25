"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Landing = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const CuriaLogo_1 = require("@/components/CuriaLogo");
const lucide_react_1 = require("lucide-react");
const clsx_1 = __importDefault(require("clsx"));
const queries_1 = require("@/hooks/queries");
const useResources_1 = require("@/hooks/useResources");
const mutations_1 = require("@/hooks/mutations");
const utils_1 = require("@/lib/utils");
const badge_1 = require("@/components/ui/badge");
const uuid_1 = require("uuid");
const date_time_picker_1 = require("@/components/ui/date-time-picker");
const locale_1 = require("date-fns/locale");
const separator_1 = require("@/components/ui/separator");
const CourtSelector_1 = require("@/components/CourtSelector");
const alert_1 = require("@/components/ui/alert");
const data_table_1 = require("@/components/ui/data-table");
const useOpenListingsData_1 = require("@/hooks/useOpenListingsData");
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const headings_1 = require("@/components/ui/headings");
const useStore_1 = require("@/hooks/useStore");
const label_1 = require("@/components/ui/label");
const date_fns_1 = require("date-fns");
const ListingDateSelector_1 = require("./ListingDateSelector");
const react_2 = require("@gsap/react");
const gsap_1 = require("gsap");
const dataFormat_1 = require("@/lib/dataFormat");
function Landing() {
    const view = (0, useStore_1.useStore)((state) => state.welcomeView);
    const setShowSettings = (0, useStore_1.useStore)((state) => state.setShowSettings);
    const mountDirection = (0, useStore_1.useStore)((state) => state.mountDirection);
    (0, react_1.useEffect)(() => {
        switch (view) {
            case "new":
                setShowSettings(false);
                break;
            case "open":
                setShowSettings(false);
                break;
            default:
                setShowSettings(true);
                break;
        }
    }, [view]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const content = () => {
        switch (view) {
            case "new":
                return (0, jsx_runtime_1.jsx)(LandingNew, {}, void 0);
            case "open":
                return (0, jsx_runtime_1.jsx)(LandingOpen, {}, void 0);
            default:
                return (0, jsx_runtime_1.jsx)(LandingInitial, {}, void 0);
        }
    };
    const container = (0, react_1.useRef)(null);
    (0, react_2.useGSAP)(() => {
        gsap_1.gsap.fromTo(".view-container", {
            x: view === undefined ? 0 : mountDirection === "left" ? -100 : 100,
            opacity: 0,
        }, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.inOut",
        });
    }, { dependencies: [view], scope: container });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ml-auto mr-auto mt-20 w-fit max-w-[80%] flex flex-col justify-center gap-2", ref: container, children: [(0, jsx_runtime_1.jsx)(CuriaLogo_1.CuriaLogoSVG, { className: (0, utils_1.cn)("w-36 ml-auto mr-auto") }, void 0), (0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h2", className: (0, utils_1.cn)("text-center mt-6"), children: t("Tervetuloa!") }, void 0), (0, jsx_runtime_1.jsx)("div", { id: "main-content", children: content() }, void 0)] }, void 0));
}
exports.Landing = Landing;
function LandingInitial() {
    const recents = (0, queries_1.useRecents)();
    const resources = (0, useResources_1.useResources)();
    const setView = (0, useStore_1.useStore)((state) => state.setWelcomeView);
    const setMountDirection = (0, useStore_1.useStore)((state) => state.setMountDirection);
    const { mutate } = (0, mutations_1.useMutateOpenListing)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatRecentLabel = (recent) => {
        if (!resources.isSuccess) {
            return "";
        }
        const court = resources.data.courts.find((c) => c.id === recent.court);
        if (!court) {
            return `${t("Tuntematon")} | ${(0, date_fns_1.format)(recent.date, "dd.MM.yyyy")}`;
        }
        const office = court.offices.find((o) => o.id === recent.office);
        const room = office ? office.rooms.find((r) => r.id === recent.room) : null;
        return `${court.name} | ${room ? room.name : t("Ei salia")} | ${(0, date_fns_1.format)(recent.date, "dd.MM.yyyy")}`;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "view-container", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-center", children: t("Aloita luomalla uusi tai valitsemalla aiemmin luotu juttuluettelo.") }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row ml-auto mr-auto justify-center w-full gap-4", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { className: "h-14 mt-4", onClick: () => {
                            setMountDirection("right");
                            setView("new");
                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.SquarePlus, { className: "mr-2 h-6 w-6" }, void 0), t("Luo uusi")] }, void 0), (0, jsx_runtime_1.jsxs)(button_1.Button, { className: "h-14 mt-4", onClick: () => {
                            setMountDirection("right");
                            setView("open");
                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "mr-2 h-6 w-6" }, void 0), t("Selaa")] }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: "text-center mt-12 font-semibold", children: t("Viimeisimmät juttuluettelot") }, void 0), recents.isSuccess && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: !recents.data || recents.data.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-center", children: t("Ei juttuluetteloita") }, void 0)) : ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col justify-center items-center ml-auto mr-auto gap-2 mt-4", children: recents.data.map((r) => ((0, jsx_runtime_1.jsx)("a", { className: (0, clsx_1.default)((0, badge_1.badgeVariants)({ variant: "default" }), "cursor-pointer"), onClick: () => mutate(r.id), children: formatRecentLabel(r) }, r.id))) }, void 0)) }, void 0))] }, void 0));
}
function LandingNew() {
    const [date, setDate] = (0, react_1.useState)(new Date());
    const [selections, setSelections] = (0, react_1.useState)({
        court: "",
        office: "",
        department: "",
        room: "",
        presiding: null,
        secretary: null,
        break: null,
        prosecutors: "",
    });
    const [valid, setValid] = (0, react_1.useState)(false);
    const { data } = (0, queries_1.useDefaults)();
    const { mutate } = (0, mutations_1.useMutateCreateListing)();
    const setView = (0, useStore_1.useStore)((state) => state.setWelcomeView);
    const setMountDirection = (0, useStore_1.useStore)((state) => state.setMountDirection);
    const resources = (0, useResources_1.useResources)();
    (0, react_1.useEffect)(() => {
        if (data) {
            setSelections(data);
            if (resources.isSuccess) {
                const { options } = (0, dataFormat_1.optionsFromCourtValues)(data, resources.data);
                setValid((0, dataFormat_1.validateCourtChoices)(data, options.departments));
            }
        }
    }, [data]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleCreateClick = async () => {
        if (!date) {
            return;
        }
        const newListing = {
            ...selections,
            break: selections.break ?? undefined,
            id: (0, uuid_1.v4)(),
            creationDate: new Date(),
            date: date,
            cases: [],
        };
        mutate(newListing);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex flex-col w-full items-center justify-center view-container"), children: [(0, jsx_runtime_1.jsx)("p", { children: t("Valitse uuden juttuluettelon tuomioistuimen tiedot ja päivämäärä.") }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-full items-center justify-center gap-4 my-4", children: [(0, jsx_runtime_1.jsx)(CourtSelector_1.CourtSelector, { values: selections, onChange: (values, validated) => {
                            setSelections({
                                ...selections,
                                ...values,
                            });
                            setValid(validated);
                        } }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center w-full gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-right", children: t("Päivämäärä") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "col-span-3", children: (0, jsx_runtime_1.jsx)(date_time_picker_1.DateTimePicker, { value: date, locale: locale_1.fi, onChange: (selected) => setDate(selected), granularity: "day", displayFormat: { hour24: "dd.MM.yyyy" } }, void 0) }, void 0)] }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "my-4" }, void 0), (0, jsx_runtime_1.jsx)(button_1.Button, { className: "w-100", disabled: !valid, onClick: handleCreateClick, children: t("Luo") }, void 0), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", className: "my-10", onClick: () => {
                    setMountDirection("left");
                    setView("initial");
                }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-6 w-6" }, void 0) }, void 0)] }, void 0));
}
function LandingOpen() {
    const { columns, data, listingsQuery } = (0, useOpenListingsData_1.useOpenListingsData)();
    const [alertOpen, setAlertOpen] = (0, react_1.useState)(false);
    const [selections, setSelections] = (0, react_1.useState)({});
    const [dateSelection, setDateSelections] = (0, react_1.useState)({});
    const [selectionActive, setSelectionActive] = (0, react_1.useState)(false);
    const remove = (0, mutations_1.useMutateDeleteListings)();
    const add = (0, mutations_1.useMutateImportListing)();
    const setView = (0, useStore_1.useStore)((state) => state.setWelcomeView);
    const setMountDirection = (0, useStore_1.useStore)((state) => state.setMountDirection);
    (0, react_1.useEffect)(() => {
        if (remove.isError || (remove.isSuccess && remove.data.errors.length > 0)) {
            setAlertOpen(true);
        }
    }, [remove.isError, remove.data, remove.isSuccess]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const content = () => {
        if (listingsQuery.isError) {
            return ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { variant: "destructive", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertTitle, { children: t("Virhe") }, void 0), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: t("Juttuluetteloita ei voitu noutaa") }, void 0)] }, void 0));
        }
        if (listingsQuery.isSuccess) {
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialog, { open: alertOpen, onOpenChange: (open) => setAlertOpen(open), children: (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogContent, { children: [(0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogHeader, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTitle, { children: t("Virhe") }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogDescription, { children: !remove.isSuccess ? (t("Juttuluetteloiden poistamisessa tapahtui määrittämätön virhe.")) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: t("Kaikkia juttuluettelotiedostoja ei voitu poistaa. Seuraavat tiedostot ovat poistamatta") }, void 0), (0, jsx_runtime_1.jsx)("ul", { children: remove.data.errors.map((error) => ((0, jsx_runtime_1.jsx)("li", { children: error }, void 0))) }, void 0), (0, jsx_runtime_1.jsx)("p", { children: t("Poista tiedostot kansiosta manuaalisesti.") }, void 0)] }, void 0)) }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogFooter, { children: (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogAction, { onClick: remove.reset, children: t("Jatka") }, void 0) }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsx)("p", { children: t("Avaa tallennettu juttuluettelo, tuo luettelo tiedostosta tai poista tallennettuja luetteloita.") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto py-2", children: (0, jsx_runtime_1.jsx)(data_table_1.DataTable, { columns: columns, data: data, filter: "global", getRowId: (row) => row.id, onRowsDeleted: remove.mutate, selections: selections, onSelectionsChanged: setSelections, additionalFilters: [
                                (0, jsx_runtime_1.jsx)(ListingDateSelector_1.ListingDateSelector, { selectionActive: selectionActive, onClearSelection: () => {
                                        const dateKeys = Object.keys(dateSelection);
                                        const filteredKeys = Object.keys(selections).filter((key) => !dateKeys.includes(key));
                                        setSelections(filteredKeys.reduce((prev, next) => {
                                            return {
                                                ...prev,
                                                [next]: selections[next],
                                            };
                                        }, {}));
                                        setDateSelections({});
                                        setSelectionActive(false);
                                    }, onDateSelected: ({ date, type }) => {
                                        let dateSelections = {};
                                        dateSelections = (listingsQuery.data ?? [])
                                            .filter((listing) => {
                                            return type === "before"
                                                ? (0, date_fns_1.isBefore)(listing.date, date)
                                                : (0, date_fns_1.isAfter)(listing.date, date);
                                        })
                                            .reduce((prev, next) => {
                                            return {
                                                ...prev,
                                                [next.id]: true,
                                            };
                                        }, dateSelections);
                                        if (Object.keys(dateSelections).length > 0) {
                                            setSelections({
                                                ...selections,
                                                ...dateSelections,
                                            });
                                            setDateSelections(dateSelections);
                                            setSelectionActive(true);
                                        }
                                    } }, "listingDateSelector"),
                            ] }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "mb-6" }, void 0), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "default", onClick: () => add.mutate(), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4 mr-2" }, void 0), t("Tuo tiedostosta")] }, void 0), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", className: "my-10", onClick: () => {
                            setMountDirection("left");
                            setView("initial");
                        }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-6 w-6" }, void 0) }, void 0)] }, void 0));
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("flex flex-col w-full items-center justify-center view-container"), children: content() }, void 0));
}
//# sourceMappingURL=index.js.map