import { LEVEL_WEIGHT, SPACER } from "../constants/level";
import { DIRECTION_TOKEN_TO_PROPERTY_MAP, SPACING_TOKEN_TO_PROPERTY_MAP } from "../constants/property";
import type { Direction, DirectionToken, Level, SpacingToken } from "../type";

import { MarkdownString } from "vscode";

const getSpacingCssValue = (level: Level) => {
  if (level === "auto") {
    return "auto;";
  }

  const rem = SPACER * LEVEL_WEIGHT[level];

  return `${rem}rem; /* ${rem * 16}px */`;
};

const getSpacingCSSCode = ({
  direction,
  level,
  spacingProperty,
}: {
  direction: Direction;
  level: Level;
  spacingProperty: string;
}) => {
  const cssValue = getSpacingCssValue(level);

  const cssCode = `${spacingProperty}-${direction}: ${cssValue}`;

  return cssCode;
};

const cssPropertiesToClass = ({
  cssProperties,
  baseToken,
  directionToken,
  level,
}: {
  cssProperties: Direction | Direction[];
  baseToken: SpacingToken;
  directionToken: DirectionToken;
  level: Level;
}) => {
  const spacingProperty = SPACING_TOKEN_TO_PROPERTY_MAP[baseToken];
  const cssValue = getSpacingCssValue(level);

  const getClass = (cssCode: string) => `.${baseToken}${directionToken}-${level} {
  ${cssCode}
}`;

  if (cssProperties === null) {
    return getClass(`${baseToken}: ${cssValue}`);
  } else if (Array.isArray(cssProperties)) {
    return getClass(
      cssProperties.map((property) => getSpacingCSSCode({ direction: property, level, spacingProperty })).join("\n  "),
    );
  }

  return getClass(getSpacingCSSCode({ direction: cssProperties, level, spacingProperty }));
};

export const getSpacingMarkdown = ({
  baseToken,
  directionToken,
  level,
}: {
  baseToken: SpacingToken;
  directionToken: DirectionToken;
  level: Level;
}) => {
  const markdown = new MarkdownString();

  const cssProperties = DIRECTION_TOKEN_TO_PROPERTY_MAP[directionToken];

  const markdownString = cssPropertiesToClass({ baseToken, cssProperties, directionToken, level });

  markdown.appendCodeblock(markdownString, "css");

  return markdown;
};
