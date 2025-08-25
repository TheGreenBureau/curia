"use strict";
/**
 * Original by Tomasz Ferens at https://medium.com/@tomaszferens/delay-unmounting-of-the-component-in-react-8d6f6e73cdc
 */
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useDelayUnmount(isMounted, delayTime) {
    const [shouldRender, setShouldRender] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        let timeoutId;
        if (isMounted && !shouldRender) {
            setShouldRender(true);
        }
        else if (!isMounted && shouldRender) {
            timeoutId = window.setTimeout(() => setShouldRender(false), delayTime);
        }
        return () => clearTimeout(timeoutId);
    }, [isMounted, delayTime, shouldRender]);
    return shouldRender;
}
exports.default = useDelayUnmount;
//# sourceMappingURL=useDelayUnmount.js.map