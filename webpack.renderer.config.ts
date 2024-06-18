import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
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
