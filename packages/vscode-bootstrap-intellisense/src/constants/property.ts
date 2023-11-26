import type { Direction, DirectionToken, DisplayBaseToken, DisplayType, SpacingToken } from "../type";

export const DIRECTION_TOKEN_TO_PROPERTY_MAP: Record<DirectionToken, Direction | Direction[]> = {
  "": null,
  b: "bottom",
  l: "left",
  r: "right",
  t: "top",
  x: ["left", "right"],
  y: ["top", "bottom"],
};

export const SPACING_TOKEN_TO_PROPERTY_MAP: Record<SpacingToken, string> = {
  m: "margin",
  p: "padding",
};

export const DISPLAY_BASE_TOKEN_TO_PROPERTY_MAP: Record<DisplayBaseToken, string> = {
  d: "display",
};

export const DISPLAY_TYPE_LIST: DisplayType[] = ["block", "inline", "inline-block", "flex", "inline-flex", "none"];
