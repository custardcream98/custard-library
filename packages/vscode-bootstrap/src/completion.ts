import { DIRECTION_TOKEN_LIST } from "./constants/direction";
import { LEVEL_WEIGHT } from "./constants/level";
import { getSpacingMarkdown } from "./markdown";
import { Level, SpacingToken } from "./type";

import {
  CompletionItem,
  CompletionItemKind,
  type CompletionItemProvider,
  type ExtensionContext,
  languages,
  Position,
  Range,
  type TextDocument,
} from "vscode";

const CLASS_NAME_REGEX = /class(?:Name)=['"][-\w\d\s]*[^"']/g;

const getCurrentClassNameRange = (document: TextDocument, position: Position) => {
  // fine current line from start to cursor
  const line = document.getText(
    new Range(new Position(position.line, 0), new Position(position.line, position.character)),
  );

  // check if the line contains a class name
  const classNameProps = line.match(CLASS_NAME_REGEX);

  if (!classNameProps || classNameProps.length === 0) {
    return;
  }

  const classNameProp = classNameProps[classNameProps.length - 1];
  console.log("classNameProp", classNameProp);
  const lastClass = classNameProp.split(" ").pop();
  console.log("lastClass", lastClass);

  if (line[line.length - 1] === " " || !lastClass) {
    // if the last character is a space, then we are at the end of the class name
    // and we should show the completion
    return new Range(new Position(position.line, position.character), new Position(position.line, position.character));
  }

  // get current class name index
  const classNameIndex = line.lastIndexOf(lastClass);

  // get current class name range
  const classNameRange = new Range(
    new Position(position.line, classNameIndex),
    new Position(position.line, position.character),
  );

  console.log("classNameRange", classNameRange.start, classNameRange.end);

  return classNameRange;
};

const getSpacingCompletions = (token: SpacingToken, range: Range) => {
  return DIRECTION_TOKEN_LIST.map((directionToken) => {
    return Object.keys(LEVEL_WEIGHT).map((level) => {
      const completionTarget = `${token}${directionToken}-${level}`;

      const completion = new CompletionItem(completionTarget, CompletionItemKind.Value);
      completion.insertText = completionTarget;
      completion.range = range;
      completion.detail = "Bootstrap 4 Spacing Utility";
      // completion.commitCharacters = completionTarget.split("");

      const markdown = getSpacingMarkdown({ baseToken: token, directionToken, level: level as Level });
      completion.documentation = markdown;

      return completion;
    });
  }).flat();
};

export const registerSpacingCompletion = (context: ExtensionContext) => {
  const spacingCompletionProvider: CompletionItemProvider = {
    provideCompletionItems(document, position) {
      const classNameRange = getCurrentClassNameRange(document, position);

      if (!classNameRange) {
        // no completion triggered
        return;
      }

      const marginCompletions = getSpacingCompletions("m", classNameRange);
      const paddingCompletions = getSpacingCompletions("p", classNameRange);

      return [...marginCompletions, ...paddingCompletions];
    },
  };

  context.subscriptions.push(languages.registerCompletionItemProvider("javascriptreact", spacingCompletionProvider));
};
