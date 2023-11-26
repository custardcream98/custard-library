export type SpacingToken = "m" | "p";

export type DirectionToken = "t" | "b" | "l" | "r" | "x" | "y" | "";
export type Direction = "top" | "bottom" | "left" | "right" | null;

export type BreakpointToken = "sm" | "md" | "lg" | "xl" | "xxl";

export type DisplayBaseToken = "d";

export type DisplayType = "block" | "inline" | "inline-block" | "flex" | "inline-flex" | "none";

export type DisplayToken =
  | `${DisplayBaseToken}-${DisplayType}`
  | `${DisplayBaseToken}-${BreakpointToken}-${DisplayType}`;

export type Level = 0 | 1 | 2 | 3 | 4 | 5 | "auto";
