import style from "./mdx-components.module.scss";

import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (props) => <a className={style.link} {...props} target="_blank" rel="noopener noreferrer" />,
    ...components,
  };
}
