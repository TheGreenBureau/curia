"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./i18n");
const react_query_1 = require("@tanstack/react-query");
const ThemeProvider_1 = require("@/components/ThemeProvider");
const client_1 = require("react-dom/client");
const Landing_1 = require("@/components/Pages/Landing");
const Listing_1 = require("@/components/Pages/Listing");
const Settings_1 = require("@/components/Pages/Settings");
const ModeToggle_1 = require("@/components/ModeToggle");
const utils_1 = require("@/lib/utils");
const LanguageToggle_1 = require("@/components/LanguageToggle");
const useResources_1 = require("@/hooks/useResources");
const CuriaLogo_1 = require("./components/CuriaLogo");
const headings_1 = require("./components/ui/headings");
const react_i18next_1 = require("react-i18next");
const useStore_1 = require("@/hooks/useStore");
const react_1 = require("react");
const react_2 = require("@gsap/react");
const gsap_1 = require("gsap");
const EasePack_1 = require("gsap/EasePack");
gsap_1.gsap.registerPlugin(react_2.useGSAP, EasePack_1.RoughEase);
const queryClient = new react_query_1.QueryClient();
const app = document.getElementById("app");
if (app) {
    const root = (0, client_1.createRoot)(app);
    root.render((0, jsx_runtime_1.jsx)(App, {}, void 0));
}
function App() {
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ThemeProvider_1.ThemeProvider, { defaultTheme: "dark", storageKey: "curia-ui-theme", children: (0, jsx_runtime_1.jsx)(Pages, {}, void 0) }, void 0) }, void 0));
}
function Pages() {
    const [initialRender, setInitialRender] = (0, react_1.useState)(true);
    const currentListing = (0, useStore_1.useStore)((state) => state.currentListing);
    const resources = (0, useResources_1.useResources)();
    const container = (0, react_1.useRef)(null);
    (0, react_2.useGSAP)(() => {
        const tl = gsap_1.gsap.timeline({
            onComplete: () => {
                setInitialRender(false);
            },
        });
        tl.to(".main-loading", {
            opacity: 1,
            delay: 0.5,
            ease: "power2.inOut",
            duration: 2,
        });
        tl.to("#curia-loading-logo", {
            scale: 1,
            duration: 2,
            ease: "power1.out",
        }, "<");
        tl.to("#curia-loading-heading", {
            opacity: 1,
            duration: 1,
            ease: "power2.inOut",
        }, "+1.9");
        tl.to("#curia-loading-heading", {
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power2.inOut",
        });
        tl.to(".main-loading", {
            height: "auto",
            marginTop: "5rem",
            duration: 2,
            ease: "power3.inOut",
        });
    }, {
        dependencies: [],
        scope: container,
    });
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)("div", { ref: container, children: [initialRender && ((0, jsx_runtime_1.jsxs)("div", { className: "ml-auto mr-auto mt-auto mb-auto w-fit max-w-[80%] flex flex-col justify-center gap-2 h-screen main-loading opacity-0", children: [(0, jsx_runtime_1.jsx)(CuriaLogo_1.CuriaLogoSVG, { className: "w-36 ml-auto mr-auto scale-[5]", id: "curia-loading-logo" }, void 0), (0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h2", className: "text-center mt-6 opacity-0", id: "curia-loading-heading", children: t("Tervetuloa Curiaan!") }, void 0)] }, void 0)), !initialRender && resources.isSuccess && ((0, jsx_runtime_1.jsxs)("div", { className: "overflow-x-hidden relative scrollbar scrollbar-thumb-slate-500 scrollbar-w-2", children: [!currentListing ? (0, jsx_runtime_1.jsx)(Landing_1.Landing, {}, void 0) : (0, jsx_runtime_1.jsx)(Listing_1.Listing, {}, void 0), (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("absolute right-8 top-4 flex align-middle gap-2"), children: [(0, jsx_runtime_1.jsx)(Settings_1.Settings, {}, void 0), (0, jsx_runtime_1.jsx)(ModeToggle_1.ModeToggle, {}, void 0), (0, jsx_runtime_1.jsx)(LanguageToggle_1.LanguageToggle, {}, void 0)] }, void 0)] }, void 0))] }, void 0));
}
//# sourceMappingURL=App.js.map