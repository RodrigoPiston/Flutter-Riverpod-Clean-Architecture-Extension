import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createFeature",
    async (uri: vscode.Uri) => {
      const featureName = await vscode.window.showInputBox({
        prompt: "Name of the feature:",
      });
      if (featureName) {
        let basePath;
        if (uri) {
          basePath = uri.fsPath;
        } else {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (workspaceFolders && workspaceFolders.length > 0) {
            basePath = workspaceFolders[0].uri.fsPath;
          } else {
            vscode.window.showErrorMessage(
              "Please open a directory before running this command."
            );
            return;
          }
        }
        const featurePath = path.join(basePath, featureName);
        if (fs.existsSync(featurePath)) {
          vscode.window.showErrorMessage(
            `The folder "${featureName}" already exists.`
          );
        } else {
          createFeatureStructure(featurePath, featureName);
        }
      }
    }
  );

  context.subscriptions.push(disposable);

  let providerDisposable = vscode.commands.registerCommand(
    "extension.createStateNotifierProvider",
    async (uri: vscode.Uri) => {
      const providerName = await vscode.window.showInputBox({
        prompt: "Name of the provider:",
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
              "Please open a directory before running this command."
            );
            return;
          }
        }
        const providerPath = path.join(basePath, providerName);
        if (fs.existsSync(providerPath)) {
          vscode.window.showErrorMessage(
            `The folder "${providerName}" already exists.`
          );
        } else {
          createStateNotifierProvider(providerPath, providerName);
        }
      }
    }
  );

  context.subscriptions.push(providerDisposable);
}

function createFeatureStructure(basePath: string, featureName: string) {
  const config = vscode.workspace.getConfiguration(
    "flutterRiverpodCleanArchitecture"
  );

  const dataDirName = config.get<string>("dataDirectory") || "data";
  const domainDirName = config.get<string>("domainDirectory") || "domain";
  const presentationDirName =
    config.get<string>("presentationDirectory") || "presentation";

  // Create directories and files for the "data" section
  const dataPath = path.join(basePath, dataDirName);
  fs.mkdirSync(dataPath, { recursive: true });
  fs.writeFileSync(path.join(dataPath, `${dataDirName}.dart`), "");

  fs.mkdirSync(path.join(dataPath, "datasources"), { recursive: true });
  fs.mkdirSync(path.join(dataPath, "repositories"), { recursive: true });
  fs.mkdirSync(path.join(dataPath, "services"), { recursive: true });

  // Create directories and files for the "domain" section
  const domainPath = path.join(basePath, domainDirName);
  fs.mkdirSync(domainPath, { recursive: true });
  fs.writeFileSync(path.join(domainPath, `${domainDirName}.dart`), "");

  fs.mkdirSync(path.join(domainPath, "datasources"), { recursive: true });
  fs.mkdirSync(path.join(domainPath, "providers"), { recursive: true });
  fs.mkdirSync(path.join(domainPath, "repositories"), { recursive: true });

  // Create directories and files for the "presentation" section
  const presentationPath = path.join(basePath, presentationDirName);
  fs.mkdirSync(presentationPath, { recursive: true });
  fs.writeFileSync(
    path.join(presentationPath, `${presentationDirName}.dart`),
    ""
  );

  fs.mkdirSync(path.join(presentationPath, "providers"), { recursive: true });
  fs.mkdirSync(path.join(presentationPath, "screens"), { recursive: true });
  fs.mkdirSync(path.join(presentationPath, "widgets"), { recursive: true });

  // Create a .dart file with the name of the feature in the root of the feature directory
  fs.writeFileSync(path.join(basePath, `${featureName}.dart`), "");
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

function toTitleCase(str: string): string {
  return str
    .split("_") // Handle snake_case
    .map((word) =>
      word
        .split("-") // Handle kebab-case
        .map((subWord) =>
          subWord
            .split(" ") // Handle space separated words
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(" ")
        )
        .join("-")
    )
    .join("");
}

export function deactivate() {}
