import type { Direction, DirectionToken, SpacingToken } from "../type";

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
