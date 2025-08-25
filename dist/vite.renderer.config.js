"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_base_config_1 = require("./vite.base.config");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
// https://vitejs.dev/config
exports.default = (0, vite_1.defineConfig)((env) => {
    const forgeEnv = env;
    const { root, mode, forgeConfigSelf } = forgeEnv;
    const name = forgeConfigSelf.name ?? "";
    return {
        root,
        mode,
        base: "./",
        build: {
            outDir: `.vite/renderer/${name}`,
        },
        plugins: [(0, vite_base_config_1.pluginExposeRenderer)(name), (0, plugin_react_1.default)()],
        resolve: {
            preserveSymlinks: true,
            alias: {
                "@": path_1.default.resolve(__dirname, "./src"),
            },
        },
        clearScreen: false,
    };
});
//# sourceMappingURL=vite.renderer.config.js.map