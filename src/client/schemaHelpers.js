export function getSchemas(openApi) {
  return openApi?.components?.schemas ?? {};
}

export function getTypeSchema(openApi, typeName) {
  if (!openApi || !typeName) {
    return null;
  }

  return getSchemas(openApi)[typeName] ?? null;
}

export function getTypeDescription(openApi, typeName) {
  return getTypeSchema(openApi, typeName)?.description ?? "";
}

export function getTypeProperties(openApi, typeName) {
  const schema = getTypeSchema(openApi, typeName);

  return schema?.properties ?? schema?.predicates ?? {};
}

export function getFieldSchema(openApi, typeName, fieldName) {
  if (!fieldName) {
    return null;
  }

  return getTypeProperties(openApi, typeName)[fieldName] ?? null;
}

export function getFieldDescription(openApi, typeName, fieldName) {
  return getFieldSchema(openApi, typeName, fieldName)?.description ?? "";
}

export function getRequiredFields(openApi, typeName) {
  const required = getTypeSchema(openApi, typeName)?.required;

  return Array.isArray(required) ? required : [];
}

export function isRequiredField(openApi, typeName, fieldName) {
  return getRequiredFields(openApi, typeName).includes(fieldName);
}

export function getFieldNames(openApi, typeName) {
  return Object.keys(getTypeProperties(openApi, typeName));
}

export function hasDisplayValue(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value === "") {
    return false;
  }

  return true;
}

export function getReadableFieldName(fieldName) {
  if (!fieldName) {
    return "";
  }

  return fieldName
    .replace(/^_/, "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getFieldLabel(openApi, typeName, fieldName) {
  return getReadableFieldName(fieldName);
}

export function getFieldHelpText(openApi, typeName, fieldName) {
  const description = getFieldDescription(openApi, typeName, fieldName);

  if (!description) {
    return "";
  }

  const allowedChoicesIndex = description.indexOf("Allowed choices:");

  if (allowedChoicesIndex > -1) {
    return description.slice(0, allowedChoicesIndex).trim();
  }

  return description.trim();
}