"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_base_config_1 = require("./vite.base.config");
// https://vitejs.dev/config
exports.default = (0, vite_1.defineConfig)((env) => {
    const forgeEnv = env;
    const { forgeConfigSelf } = forgeEnv;
    const config = {
        build: {
            rollupOptions: {
                external: vite_base_config_1.external,
                // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
                input: forgeConfigSelf.entry,
                output: {
                    format: 'cjs',
                    // It should not be split chunks.
                    inlineDynamicImports: true,
                    entryFileNames: '[name].js',
                    chunkFileNames: '[name].js',
                    assetFileNames: '[name].[ext]',
                },
            },
        },
        plugins: [(0, vite_base_config_1.pluginHotRestart)('reload')],
    };
    return (0, vite_1.mergeConfig)((0, vite_base_config_1.getBuildConfig)(forgeEnv), config);
});
//# sourceMappingURL=vite.preload.config.js.map