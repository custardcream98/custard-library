import { registerDisplayCompletion, registerSpacingCompletion } from "./completion";

import { type ExtensionContext, window } from "vscode";

export function activate(context: ExtensionContext) {
  window.showInformationMessage('"vscode-bootstrap" is now active!');

  registerSpacingCompletion(context);
  registerDisplayCompletion(context);
}

export function deactivate() {
  window.showInformationMessage('"vscode-bootstrap" deactivated!');
}
