/**
 * HTML Escaping Utility
 * Prevents XSS attacks by escaping HTML special characters in user input
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

/**
 * Escapes HTML special characters in a string to prevent XSS attacks
 * @param text - The string to escape
 * @returns The escaped string safe for HTML insertion
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Escapes HTML in an object's string values (shallow)
 * @param obj - Object with string values to escape
 * @returns New object with escaped string values
 */
export function escapeHtmlObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = escapeHtml(value);
    }
  }
  return result;
}
