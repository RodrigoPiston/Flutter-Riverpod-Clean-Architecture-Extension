import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { toTitleCase } from "../utils/stringFormatter";
import { Constants } from "../utils/constants";

export async function createStateNotifierProviderCommand(uri: vscode.Uri) {
  const providerName = await vscode.window.showInputBox({
    prompt: Constants.PROMPT_PROVIDER_NAME,
  });
  if (providerName) {
    let basePath;
    if (uri) {
      basePath = uri.fsPath;
    } else {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders && workspaceFolders.length > 0) {
        basePath = workspaceFolders[0].uri.fsPath;
      } else {
        vscode.window.showErrorMessage(
            Constants.ERROR_OPEN_DIRECTORY
        );
        return;
      }
    }
    const providerPath = path.join(basePath, providerName);
    if (fs.existsSync(providerPath)) {
      vscode.window.showErrorMessage(
        `${Constants.ERROR_FOLDER_EXISTS} "${providerName}".`
      );
    } else {
      createStateNotifierProvider(providerPath, providerName);
    }
  }
}

function createStateNotifierProvider(basePath: string, providerName: string) {
  const formattedProviderName = toTitleCase(providerName);

  // Create provider directory
  fs.mkdirSync(basePath, { recursive: true });

  const riverpodImport =
    "import 'package:flutter_riverpod/flutter_riverpod.dart';\n";

  // Create notifier file
  const notifierContent = `${riverpodImport}
  class ${formattedProviderName}Notifier extends StateNotifier<${formattedProviderName}State> {
      ${formattedProviderName}Notifier() : super(${formattedProviderName}State());
      // Define methods and properties here
  }
  `;
  fs.writeFileSync(
    path.join(basePath, `${providerName}_notifier.dart`),
    notifierContent
  );

  // Create provider file
  const providerContent = `${riverpodImport}
  final ${formattedProviderName}Provider = StateNotifierProvider<${formattedProviderName}Notifier, ${formattedProviderName}State>(
      (ref) => ${formattedProviderName}Notifier(),
  );
  `;
  fs.writeFileSync(
    path.join(basePath, `${providerName}_provider.dart`),
    providerContent
  );

  // Create state file
  const stateContent = `${riverpodImport}
  class ${formattedProviderName}State {
      // Define state properties and constructors here
  }
  `;
  fs.writeFileSync(
    path.join(basePath, `${providerName}_state.dart`),
    stateContent
  );
}
