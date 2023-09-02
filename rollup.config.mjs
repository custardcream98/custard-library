import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

import path from "path";

const PACKAGE_ROOT_PATH = path.resolve(
  process.cwd(),
  "./packages"
);

const getRollupConfig = (packageFolderName) => {
  const packagePath = path.resolve(
    PACKAGE_ROOT_PATH,
    packageFolderName
  );

  const packageJson = require(
    path.resolve(packagePath, "package.json")
  );
  const tsConfigJson = require(
    path.resolve(packagePath, "tsconfig.json")
  );
  const indexPath = path.resolve(
    packagePath,
    "src/index.ts"
  );
  const { main, module, types } = packageJson;

  return [
    {
      input: indexPath,
      output: [
        {
          dir: path.resolve(packagePath, main),
          format: "cjs",
          sourcemap: true,
          preserveModules: true,
        },
        {
          dir: path.resolve(packagePath, module),
          format: "esm",
          sourcemap: true,
          preserveModules: true,
        },
      ],
      plugins: [
        nodeResolve(),
        typescript({
          tsconfig: path.resolve(
            packagePath,
            "tsconfig.json"
          ),
        }),
        commonjs(),
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
          tsconfig: path.resolve(
            packagePath,
            "tsconfig.json"
          ),
        }),
      ],
    },
  ];
};

const rollupConfigs = [...getRollupConfig("react-gantt")];

export default rollupConfigs;
