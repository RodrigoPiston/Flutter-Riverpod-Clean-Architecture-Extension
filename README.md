# Flutter Riverpod Clean Architecture README

This extension provides a streamlined way to scaffold out new features in a Flutter project using a clean architecture approach. With just a few clicks, developers can generate a structured directory and file setup, adhering to clean architecture principles, saving time and ensuring consistency across the project.

## Features

- **Quick Feature Generation**: Right-click in the VS Code file explorer where you want to create a new feature, run the "Create New Feature" command, enter the name of the feature, and the extension will create a well-structured set of directories and files for that feature.
- **Clean Architecture Compliance**: The generated structure complies with clean architecture principles, separating concerns into `data`, `domain`, and `presentation` layers.
- **Customizable Feature Naming**: Each feature scaffolding is named according to the feature name you provide, making it easy to identify and manage multiple features in a project.
- **Configurable Directory and File Names**: Customize the names of generated directories and files through the extension settings to better align with your project's naming conventions.

> Tip: The provided command can also be triggered via the command palette (Ctrl+Shift+P) in VS Code, by typing and selecting "Create New Feature".

## Requirements

- Visual Studio Code
- A Flutter project

## Extension Settings

This extension contributes the following settings:

* `flutterRiverpodCleanArchitecture.dataDirectory`: Customize the name of the `data` directory.
* `flutterRiverpodCleanArchitecture.domainDirectory`: Customize the name of the `domain` directory.
* `flutterRiverpodCleanArchitecture.presentationDirectory`: Customize the name of the `presentation` directory.

## Known Issues

Currently, there are no known issues. However, if you encounter any bugs or have feature requests, feel free to open an issue on the GitHub repository.

## Release Notes

### 1.0.0

Initial release of Flutter Riverpod Clean Architecture.

### 1.0.1

- Added extension settings to allow customization of directory and file names.
