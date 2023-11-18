import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {};

const withMDX = createMDX({
  options: {
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
