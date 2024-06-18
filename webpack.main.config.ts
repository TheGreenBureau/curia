import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      "@state": path.resolve(__dirname, "./src/renderer/state"),
      "@components": path.resolve(__dirname, "./src/renderer/components"),
      "@locales": path.resolve(__dirname, "./src/locales"),
      "@img": path.resolve(__dirname, "./src/img"),
      "@configuration": path.resolve(
        __dirname,
        "./src/main/configuration/index.ts"
      ),
      "@paths": path.resolve(__dirname, "./src/main/configuration/paths.ts"),
      "@database": path.resolve(__dirname, "./src/main/database"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
};
