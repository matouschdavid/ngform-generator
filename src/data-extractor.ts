export function extractData(text: string) {
  const classData = extractClassData(text);
  const propertiesData = extractPropertiesData(text);
  propertiesData.push(...extractConstructorData(text));
  return new ClassData(classData.name, propertiesData);
}

function extractClassData(text: string) {
  const classRegex = /export class (\w+)/;
  const match = classRegex.exec(text);
  if (match) {
    return new ClassData(match[1], []);
  }
  return new ClassData("", []);
}

function extractPropertiesData(text: string) {
  const propertiesRegex = /(\w+)(\?)*: (\w+)/g;
  const propertiesData: PropertyData[] = [];
  let match;
  while ((match = propertiesRegex.exec(text))) {
    propertiesData.push(new PropertyData(match[1], match[3], match[2] === "?"));
  }
  return propertiesData;
}

function extractConstructorData(text: string) {
  const constructorRegex = /constructor\((.*)\)/;
  const match = constructorRegex.exec(text);
  if (match) {
    const properties = match[1].split(",").map((p) => p.trim());
    const propertiesData: PropertyData[] = [];
    properties.forEach((p) => {
      const [name, type] = p.split(":");
      propertiesData.push(new PropertyData(name, type, false));
    });
    return propertiesData;
  }
  return [];
}

export class ClassData {
  constructor(public name: string, public properties: PropertyData[]) {}
}

export class PropertyData {
  constructor(
    public name: string,
    public type: string,
    public isOptional: boolean
  ) {}
}
