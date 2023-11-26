import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { dts } from "rollup-plugin-dts";
import autoprefixer from "autoprefixer";
import styles from "rollup-plugin-styles";
import { swc } from "rollup-plugin-swc3";

import path from "path";
import fs from "fs";

import { customStyleInjector } from "./css-injector";

const PACKAGE_ROOT_PATH = path.resolve(process.cwd(), "./packages");

const getRollupConfig = (packageFolderName) => {
  const packagePath = path.resolve(PACKAGE_ROOT_PATH, packageFolderName);

  const packageJson = require(path.resolve(packagePath, "package.json"));
  const { main, module, types } = packageJson;
  const tsConfigJson = require(path.resolve(packagePath, "tsconfig.json"));
  const indexPath = path.resolve(packagePath, "src/index.ts");
  const isDevelopment = process.env.NODE_ENV === "development";
  const assetFileNames = isDevelopment ? "[name][extname]" : "[hash]";

  return [
    {
      input: indexPath,
      output: [
        {
          dir: path.resolve(packagePath, main, "../"),
          format: "cjs",
          sourcemap: !isDevelopment,
          preserveModules: true,
          preserveModulesRoot: path.resolve(packagePath, "src"),
          exports: "named",
        },
        {
          dir: path.resolve(packagePath, module, "../"),
          format: "esm",
          sourcemap: !isDevelopment,
          preserveModules: true,
          preserveModulesRoot: path.resolve(packagePath, "src"),
          exports: "named",
        },
      ],
      external: [...Object.keys(packageJson.peerDependencies || {})],
      plugins: [
        nodeResolve(),
        swc({
          exclude: "**/node_modules/**",
          tsconfig: path.resolve(packagePath, "tsconfig.json"),
          minify: !isDevelopment,
          sourceMaps: !isDevelopment,
          jsc: { minify: { sourceMap: !isDevelopment } },
        }),
        styles({
          plugins: [autoprefixer],
          autoModules: true,
          modules: {
            generateScopedName: isDevelopment ? "[name]_[local]__[hash:8]" : "[hash:8]",
          },
          mode: ["inject", customStyleInjector(packageFolderName)],
        }),
        commonjs(),
      ],
    },
    {
      input: indexPath,
      output: [
        {
          file: path.resolve(packagePath, types),
          format: "esm",
        },
      ],
      plugins: [
        dts({
          tsconfig: path.resolve(packagePath, "tsconfig.json"),
        }),
      ],
    },
  ];
};

const packages = fs
  .readdirSync(PACKAGE_ROOT_PATH)
  .filter((name) => !name.includes("eslint") && !name.includes("vscode"));
const rollupConfigs = packages.map((packageFolderName) => getRollupConfig(packageFolderName)).flat();

export default rollupConfigs;
