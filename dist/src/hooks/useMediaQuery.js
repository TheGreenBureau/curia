"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMediaQuery = void 0;
const react_1 = require("react");
function useMediaQuery(query) {
    const [matches, setMatches] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const matchQueryList = window.matchMedia(query);
        function handleChange(e) {
            setMatches(e.matches);
        }
        matchQueryList.addEventListener("change", handleChange);
        return () => {
            matchQueryList.removeEventListener("change", handleChange);
        };
    }, [query]);
    return matches;
}
exports.useMediaQuery = useMediaQuery;
//# sourceMappingURL=useMediaQuery.js.map