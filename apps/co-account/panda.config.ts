import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  exclude: [],

  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  outdir: "styled-system",

  preflight: true,

  theme: {
    extend: {},
  },
});
