import { ClassData, PropertyData } from "./data-extractor";
import * as vscode from "vscode";
let configuration: vscode.WorkspaceConfiguration;
export function generateHtmlForm(classData: ClassData) {
  configuration = vscode.workspace.getConfiguration("formStyling");
  const form = `<form ${getConfiguredClasses(
    "formClasses"
  )} (ngSubmit)="submitForm()">
${classData.properties.map((p) => generateHtmlInput(classData, p)).join("\r")}
<button ${getConfiguredClasses("buttonClasses")} type="submit">Submit</button>
</form>`;
  return form;
}

function generateHtmlInput(classData: ClassData, propertyData: PropertyData) {
  const input = `<label ${getConfiguredClasses("labelClasses")} for="${
    propertyData.name
  }">${propertyData.name}${displayRequiredMarker(propertyData)}</label>
  <input ${getConfiguredClasses("inputClasses")} type="${convertToInputType(
    propertyData.type
  )}" id="${propertyData.name}" [(ngModel)]="${toCamelCase(classData.name)}.${
    propertyData.name
  }" ${propertyData.isOptional ? "" : "required"}>`;
  return input;
}

function toCamelCase(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function convertToInputType(type: string): "text" | "number" | "checkbox" {
  switch (type) {
    case "string":
      return "text";
    case "number":
      return "number";
    case "boolean":
      return "checkbox";
    default:
      return "text";
  }
}

function displayRequiredMarker(propertyData: PropertyData) {
  if (configuration.get("useRequiredMarkers")) {
    return propertyData.isOptional
      ? ""
      : `<span ${getConfiguredClasses(
          "requiredMarkerClasses"
        )}>${configuration.get("requiredMarker")}</span>`;
  }
  return "";
}

function getConfiguredClasses(setting: string) {
  const classes = configuration.get(setting);
  return classes ? `class="${classes}"` : "";
}
