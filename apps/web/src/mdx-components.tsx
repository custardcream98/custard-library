import type { MDXComponents } from "mdx/types";

import style from "./mdx-components.module.scss";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (props) => <a className={style.link} {...props} target="_blank" rel="noopener noreferrer" />,
    ...components,
  };
}
