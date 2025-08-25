"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = exports.ThemeProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const initialState = {
    theme: "system",
    setTheme: () => null,
};
const ThemeProviderContext = (0, react_1.createContext)(initialState);
function ThemeProvider({ children, defaultTheme = "system", storageKey = "curia-ui-theme", ...props }) {
    const [theme, setTheme] = (0, react_1.useState)(() => localStorage.getItem(storageKey) || defaultTheme);
    (0, react_1.useEffect)(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
            return;
        }
        root.classList.add(theme);
    }, [theme]);
    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };
    return ((0, jsx_runtime_1.jsx)(ThemeProviderContext.Provider, { ...props, value: value, children: children }, void 0));
}
exports.ThemeProvider = ThemeProvider;
const useTheme = () => {
    const context = (0, react_1.useContext)(ThemeProviderContext);
    if (context === undefined) {
        throw new Error("useTheme only inside a ThemeProvider");
    }
    return context;
};
exports.useTheme = useTheme;
//# sourceMappingURL=ThemeProvider.js.map