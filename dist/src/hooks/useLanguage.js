"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLanguage = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const langKey = "curia-ui-lang";
const useLanguage = () => {
    const [language, setLanguage] = (0, react_1.useState)(() => {
        const stored = localStorage.getItem(langKey);
        return stored === "fi" || stored == "sv" ? stored : "fi";
    });
    const { i18n } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        if (i18n.resolvedLanguage !== language) {
            i18n.changeLanguage(language);
        }
        if (language !== localStorage.getItem(langKey)) {
            localStorage.setItem(langKey, language);
        }
    }, [language]);
    return [language, setLanguage];
};
exports.useLanguage = useLanguage;
//# sourceMappingURL=useLanguage.js.map