import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Constants } from "../utils/constants";

export async function createFeatureCommand(uri: vscode.Uri) {
  const featureName = await vscode.window.showInputBox({
    prompt: Constants.PROMPT_FEATURE_NAME,
  });
  if (featureName) {
    let basePath = await determineBasePath(uri);
    if (!basePath) {return;}

    const featurePath = path.join(basePath, featureName);
    if (fs.existsSync(featurePath)) {
      vscode.window.showErrorMessage(
        `${Constants.ERROR_FOLDER_EXISTS} "${featureName}".`
      );
      return;
    }

    const includeAdditionalFiles = await vscode.window.showQuickPick(
      ['Yes', 'No'],
      { placeHolder: Constants.PROMPT_INCLUDE_FILES }
    );

    createFeatureStructure(featurePath, featureName, includeAdditionalFiles === 'Yes');
  }
}

async function determineBasePath(uri: vscode.Uri): Promise<string | undefined> {
  if (uri) {
    return uri.fsPath;
  } else {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders?.length) {
      return workspaceFolders[0].uri.fsPath;
    } else {
      vscode.window.showErrorMessage(Constants.ERROR_OPEN_DIRECTORY);
    }
  }
}

function createFeatureStructure(basePath: string, featureName: string, includeAdditionalFiles: boolean) {
  const config = vscode.workspace.getConfiguration("flutterRiverpodCleanArchitecture");

  createSection(basePath, config, 'dataDirectory', 'data', includeAdditionalFiles, ['datasources', 'repositories', 'services']);
  createSection(basePath, config, 'domainDirectory', 'domain', includeAdditionalFiles, ['datasources', 'repositories', 'usecases']);
  createSection(basePath, config, 'presentationDirectory', 'presentation', includeAdditionalFiles, ['providers', 'screens', 'widgets']);

  const featureFilePath = path.join(basePath, `${featureName}.dart`);
  const exportContent = `export 'data/data.dart';
export 'domain/domain.dart';
export 'presentation/presentation.dart';\n`;
  fs.writeFileSync(featureFilePath, exportContent);
}

function createSection(basePath: string, config: vscode.WorkspaceConfiguration, configKey: string, defaultDirName: string, includeFiles: boolean, subDirs: string[]) {
  const dirName = config.get<string>(configKey) || defaultDirName;
  const sectionPath = path.join(basePath, dirName);
  fs.mkdirSync(sectionPath, { recursive: true });

  if (subDirs.length > 0) {
    let exportContent = '';

    subDirs.forEach(dir => {
      const dirPath = path.join(sectionPath, dir);
      fs.mkdirSync(dirPath, { recursive: true });
      if(includeFiles){
        const fileName = `${dir}.dart`;
        fs.writeFileSync(path.join(dirPath, fileName), '');
        exportContent += `export '${dir}/${fileName}';\n`;
      }
    });

    const sectionFilePath = path.join(sectionPath, `${dirName}.dart`);
    fs.writeFileSync(sectionFilePath, exportContent);
  }
}

export function deactivate() {}
