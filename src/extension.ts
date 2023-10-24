import * as vscode from "vscode";
import { createFeatureCommand } from "./commands/createFeature";
import { createStateNotifierProviderCommand } from "./commands/createStateNotifierProvider";

export function activate(context: vscode.ExtensionContext) {
  let disposableCreateFeature = vscode.commands.registerCommand(
    "extension.createFeature",
    async (uri: vscode.Uri) => {
      await createFeatureCommand(uri);
    }
  );

  context.subscriptions.push(disposableCreateFeature);

  let providerDisposable = vscode.commands.registerCommand(
    "extension.createStateNotifierProvider",
    async (uri: vscode.Uri) => {
      await createStateNotifierProviderCommand(uri);
    }
  );

  context.subscriptions.push(providerDisposable);
}

export function deactivate() {}
