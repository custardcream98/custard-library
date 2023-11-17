const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["tsx", "md", "mdx"],
};

module.exports = withMDX(nextConfig);
