export const parseArrayField = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((v) => v.trim()).filter(Boolean);
  }

  // Case 2: JSON array string
  if (typeof value === "string" && value.trim().startsWith("[")) {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error();
    return parsed.map((v) => v.trim()).filter(Boolean);
  }

  // Case 3: Comma-separated string
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  throw new Error();
};
