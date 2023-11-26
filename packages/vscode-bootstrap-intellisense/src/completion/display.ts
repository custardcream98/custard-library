import { BREAKPOINT_TOKEN_TO_NUMBER_MAP } from "../constants/breakpoint";
import { DISPLAY_TYPE_LIST } from "../constants/property";
import { getDisplayMarkdown } from "../markdown";
import { DisplayBaseToken } from "../type";
import { objectKeys } from "../utils/object";
import { getCurrentClassNameRange } from "../utils/range";

import {
  CompletionItem,
  CompletionItemKind,
  type CompletionItemProvider,
  type ExtensionContext,
  languages,
  Range,
} from "vscode";

const getDisplayCompletions = ({ baseToken, range }: { baseToken: DisplayBaseToken; range: Range }) => {
  return DISPLAY_TYPE_LIST.map((displayType) => {
    return objectKeys(BREAKPOINT_TOKEN_TO_NUMBER_MAP).map((breakpointToken) => {
      const completionTarget = [baseToken, breakpointToken, displayType].filter((token) => !!token).join("-");
      const completion = new CompletionItem(completionTarget, CompletionItemKind.Value);
      completion.insertText = completionTarget;
      completion.range = range;
      completion.detail = "Bootstrap 4 Display Utility";

      const markdown = getDisplayMarkdown({
        baseToken,
        breakpointToken,
        displayType,
      });
      completion.documentation = markdown;

      return completion;
    });
  }).flat();
};

export const registerDisplayCompletion = (context: ExtensionContext) => {
  const displayCompletions: CompletionItemProvider = {
    provideCompletionItems(document, position) {
      const classNameRange = getCurrentClassNameRange(document, position);

      if (!classNameRange) {
        // no completion triggered
        return;
      }

      const displayCompletions = getDisplayCompletions({ baseToken: "d", range: classNameRange });

      return displayCompletions;
    },
  };

  context.subscriptions.push(languages.registerCompletionItemProvider("javascriptreact", displayCompletions));
};
