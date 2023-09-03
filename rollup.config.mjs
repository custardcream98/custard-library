import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
import autoprefixer from "autoprefixer";
import babel from "@rollup/plugin-babel";
import styles from "rollup-plugin-styles";

import path from "path";

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
          dir: path.resolve(packagePath, main),
          format: "cjs",
          sourcemap: true,
        },
        {
          dir: path.resolve(packagePath, module),
          format: "esm",
          sourcemap: true,
        },
      ],
      external: [...Object.keys(packageJson.peerDependencies || {})],
      plugins: [
        nodeResolve(),
        typescript({
          tsconfig: path.resolve(packagePath, "tsconfig.json"),
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
        babel({
          babelHelpers: "runtime",
          exclude: "**/node_modules/**",
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-transform-runtime"],
        }),
        terser(),
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

const rollupConfigs = [...getRollupConfig("react-gantt")];

export default rollupConfigs;
