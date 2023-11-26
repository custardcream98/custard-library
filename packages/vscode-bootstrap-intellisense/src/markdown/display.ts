import { DISPLAY_BASE_TOKEN_TO_PROPERTY_MAP } from "../constants/property";
import type { BreakpointToken, DisplayBaseToken, DisplayType } from "../type";

import { getBreakpointMarkdownWrapper } from "./breakpoint";

import { MarkdownString } from "vscode";

const getDisplayCSSCode = ({
  baseToken,
  breakpointToken,
  displayType,
}: {
  baseToken: DisplayBaseToken;
  breakpointToken?: BreakpointToken;
  displayType: DisplayType;
}) => {
  const className = [baseToken, breakpointToken, displayType].filter((token) => !!token).join("-");
  const cssProperty = `${DISPLAY_BASE_TOKEN_TO_PROPERTY_MAP[baseToken]}: ${displayType};`;

  const cssCode = `.${className} {
  ${cssProperty}
}`;

  if (breakpointToken) {
    const beautifiedCssCode = cssCode.split("\n").join("\n  ");

    return getBreakpointMarkdownWrapper(breakpointToken)(beautifiedCssCode);
  }

  return cssCode;
};

export const getDisplayMarkdown = ({
  baseToken,
  breakpointToken,
  displayType,
}: {
  baseToken: DisplayBaseToken;
  breakpointToken?: BreakpointToken;
  displayType: DisplayType;
}) => {
  const markdown = new MarkdownString();

  const cssCode = getDisplayCSSCode({ baseToken, breakpointToken, displayType });

  markdown.appendCodeblock(cssCode, "css");

  return markdown;
};
