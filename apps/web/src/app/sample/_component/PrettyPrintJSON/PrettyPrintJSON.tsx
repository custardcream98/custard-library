import highlightJs from "highlight.js";
import highlightJsJson from "highlight.js/lib/languages/json";

import style from "./PrettyPrintJSON.module.scss";
import "./hljs.scss";

highlightJs.registerLanguage("json", highlightJsJson);

export const PrettyPrintJSON = ({ json }: { json: any }) => {
  const stringified = JSON.stringify(json, null, 4);
  const highlighted = highlightJs.highlight(stringified, {
    language: "json",
  }).value;

  return (
    <pre className={style.wrapper}>
      <code className={style.code} dangerouslySetInnerHTML={{ __html: highlighted }}></code>
    </pre>
  );
};
