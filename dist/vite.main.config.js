"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_base_config_1 = require("./vite.base.config");
const path_1 = __importDefault(require("path"));
// https://vitejs.dev/config
exports.default = (0, vite_1.defineConfig)((env) => {
    const forgeEnv = env;
    const { forgeConfigSelf } = forgeEnv;
    const define = (0, vite_base_config_1.getBuildDefine)(forgeEnv);
    const config = {
        build: {
            lib: {
                entry: forgeConfigSelf.entry,
                fileName: () => "[name].js",
                formats: ["cjs"],
            },
            rollupOptions: {
                external: vite_base_config_1.external,
            },
        },
        plugins: [(0, vite_base_config_1.pluginHotRestart)("restart")],
        define,
        resolve: {
            // Load the Node.js entry.
            mainFields: ["module", "jsnext:main", "jsnext"],
            alias: {
                "@": path_1.default.resolve(__dirname, "./src"),
            },
        },
    };
    return (0, vite_1.mergeConfig)((0, vite_base_config_1.getBuildConfig)(forgeEnv), config);
});
//# sourceMappingURL=vite.main.config.js.map