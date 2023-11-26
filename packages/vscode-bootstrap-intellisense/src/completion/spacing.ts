import { DIRECTION_TOKEN_LIST } from "../constants/direction";
import { LEVEL_WEIGHT } from "../constants/level";
import { getSpacingMarkdown } from "../markdown";
import { Level, SpacingToken } from "../type";
import { getCurrentClassNameRange } from "../utils/range";

import {
  CompletionItem,
  CompletionItemKind,
  type CompletionItemProvider,
  type ExtensionContext,
  languages,
  Range,
} from "vscode";

const getSpacingCompletions = (token: SpacingToken, range: Range) => {
  return DIRECTION_TOKEN_LIST.map((directionToken) => {
    return Object.keys(LEVEL_WEIGHT).map((level) => {
      const completionTarget = `${token}${directionToken}-${level}`;

      const completion = new CompletionItem(completionTarget, CompletionItemKind.Value);
      completion.insertText = completionTarget;
      completion.range = range;
      completion.detail = "Bootstrap 4 Spacing Utility";

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
