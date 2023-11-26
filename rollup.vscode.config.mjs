import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { swc } from "rollup-plugin-swc3";

import path from "path";
import fs from "fs";

const PACKAGE_ROOT_PATH = path.resolve(process.cwd(), "./packages");

const getVsCodeExtensionRollupConfig = (packageFolderName) => {
  const packagePath = path.resolve(PACKAGE_ROOT_PATH, packageFolderName);
  const packageJson = require(path.resolve(packagePath, "package.json"));
  const { main } = packageJson;
  const tsConfigJson = require(path.resolve(packagePath, "tsconfig.json"));
  const indexPath = path.resolve(packagePath, "src/index.ts");

  return [
    {
      input: indexPath,
      output: {
        dir: path.resolve(packagePath, main, "../"),
        format: "cjs",
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: path.resolve(packagePath, "src"),
        exports: "named",
      },
      external: [...Object.keys(packageJson.peerDependencies || {})],
      plugins: [
        nodeResolve(),
        swc({
          exclude: "**/node_modules/**",
          tsconfig: path.resolve(packagePath, "tsconfig.json"),
          sourceMaps: true,
        }),
        commonjs(),
      ],
    },
  ];
};

const vscodePackages = fs.readdirSync(PACKAGE_ROOT_PATH).filter((name) => name.includes("vscode"));
const vscodeRollupConfigs = vscodePackages
  .map((packageFolderName) => getVsCodeExtensionRollupConfig(packageFolderName))
  .flat();

export default vscodeRollupConfigs;
