import * as vscode from "vscode";
import { extractData } from "./data-extractor";
import { generateHtmlForm } from "./form-generator";

export function activate(context: vscode.ExtensionContext) {
  const ncp = require("copy-paste");
  let disposable = vscode.commands.registerTextEditorCommand(
    "ngform-generator.generate-form",
    (textEditor, _) => {
      const text = textEditor.document.getText();
      const classData = extractData(text);
      const form = generateHtmlForm(classData);
      ncp.copy(form, () => {
        vscode.window.showInformationMessage("Form copied to clipboard");
      });
    }
  );

  context.subscriptions.push(disposable);
}
