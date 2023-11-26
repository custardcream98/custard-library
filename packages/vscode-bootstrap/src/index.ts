import { registerSpacingCompletion } from "./completion";

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('"vscode-bootstrap" is now active!');

  registerSpacingCompletion(context);
}

export function deactivate() {
  vscode.window.showInformationMessage('"vscode-bootstrap" deactivated!');
}
