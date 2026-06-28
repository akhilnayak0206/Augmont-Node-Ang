export function escapeCSVField(value: unknown): string {
  const str = String(value ?? "");

  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export function toCsvLine(fields: unknown[]): string {
  return fields.map(escapeCSVField).join(",") + "\n";
}