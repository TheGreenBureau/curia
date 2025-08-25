"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const zustand_1 = require("zustand");
exports.useStore = (0, zustand_1.create)()((set) => ({
    welcomeView: undefined,
    mountDirection: "right",
    showSettings: true,
    currentListing: null,
    setWelcomeView: (state) => set({ welcomeView: state }),
    setMountDirection: (direction) => set({ mountDirection: direction }),
    setShowSettings: (show) => set({ showSettings: show }),
    setCurrentListing: (value) => set({ currentListing: value }),
}));
//# sourceMappingURL=useStore.js.map