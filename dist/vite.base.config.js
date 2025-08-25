"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginHotRestart = exports.pluginExposeRenderer = exports.getBuildDefine = exports.getDefineKeys = exports.getBuildConfig = exports.external = exports.builtins = void 0;
const node_module_1 = require("node:module");
const package_json_1 = __importDefault(require("./package.json"));
const path_1 = __importDefault(require("path"));
exports.builtins = [
    "electron",
    ...node_module_1.builtinModules.map((m) => [m, `node:${m}`]).flat(),
];
exports.external = [
    ...exports.builtins,
    ...Object.keys("dependencies" in package_json_1.default ? package_json_1.default.dependencies : {}),
];
function getBuildConfig(env) {
    const { root, mode, command } = env;
    return {
        root,
        mode,
        build: {
            // Prevent multiple builds from interfering with each other.
            emptyOutDir: false,
            // 🚧 Multiple builds may conflict.
            outDir: ".vite/build",
            watch: command === "serve" ? {} : null,
            minify: command === "build",
        },
        clearScreen: false,
        resolve: {
            alias: {
                "@": path_1.default.resolve(__dirname, "./src"),
            },
        },
    };
}
exports.getBuildConfig = getBuildConfig;
function getDefineKeys(names) {
    const define = {};
    return names.reduce((acc, name) => {
        const NAME = name.toUpperCase();
        const keys = {
            VITE_DEV_SERVER_URL: `${NAME}_VITE_DEV_SERVER_URL`,
            VITE_NAME: `${NAME}_VITE_NAME`,
        };
        return { ...acc, [name]: keys };
    }, define);
}
exports.getDefineKeys = getDefineKeys;
function getBuildDefine(env) {
    const { command, forgeConfig } = env;
    const names = forgeConfig.renderer
        .filter(({ name }) => name != null)
        .map(({ name }) => name);
    const defineKeys = getDefineKeys(names);
    const define = Object.entries(defineKeys).reduce((acc, [name, keys]) => {
        const { VITE_DEV_SERVER_URL, VITE_NAME } = keys;
        const def = {
            [VITE_DEV_SERVER_URL]: command === "serve"
                ? JSON.stringify(process.env[VITE_DEV_SERVER_URL])
                : undefined,
            [VITE_NAME]: JSON.stringify(name),
        };
        return { ...acc, ...def };
    }, {});
    return define;
}
exports.getBuildDefine = getBuildDefine;
function pluginExposeRenderer(name) {
    const { VITE_DEV_SERVER_URL } = getDefineKeys([name])[name];
    return {
        name: "@electron-forge/plugin-vite:expose-renderer",
        configureServer(server) {
            process.viteDevServers ??= {};
            // Expose server for preload scripts hot reload.
            process.viteDevServers[name] = server;
            server.httpServer?.once("listening", () => {
                const addressInfo = server.httpServer.address();
                // Expose env constant for main process use.
                process.env[VITE_DEV_SERVER_URL] = `http://localhost:${addressInfo?.port}`;
            });
        },
    };
}
exports.pluginExposeRenderer = pluginExposeRenderer;
function pluginHotRestart(command) {
    return {
        name: "@electron-forge/plugin-vite:hot-restart",
        closeBundle() {
            if (command === "reload") {
                for (const server of Object.values(process.viteDevServers)) {
                    // Preload scripts hot reload.
                    server.ws.send({ type: "full-reload" });
                }
            }
            else {
                // Main process hot restart.
                // https://github.com/electron/forge/blob/v7.2.0/packages/api/core/src/api/start.ts#L216-L223
                process.stdin.emit("data", "rs");
            }
        },
    };
}
exports.pluginHotRestart = pluginHotRestart;
//# sourceMappingURL=vite.base.config.js.map