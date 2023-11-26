import { registerSpacingCompletion } from "./completion";

import { type ExtensionContext, window } from "vscode";

export function activate(context: ExtensionContext) {
  window.showInformationMessage('"vscode-bootstrap" is now active!');

  registerSpacingCompletion(context);
}

export function deactivate() {
  window.showInformationMessage('"vscode-bootstrap" deactivated!');
}
