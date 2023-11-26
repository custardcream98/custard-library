import { BREAKPOINT_TOKEN_TO_NUMBER_MAP } from "../constants/breakpoint";
import { BreakpointToken } from "../type";

export const getBreakpointMarkdownWrapper = (breakpointToken: BreakpointToken) => (cssCode: string) => {
  const breakpoint = BREAKPOINT_TOKEN_TO_NUMBER_MAP[breakpointToken];

  return `@media (min-width: ${breakpoint}px) {
  ${cssCode}
}`;
};
