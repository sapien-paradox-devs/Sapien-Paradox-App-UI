import { labels } from "./labels";

/**
 * Retrieves a label from the centralized labels file using dot notation.
 * @param path - The dot-notated path to the label (e.g., "landingPage.hero.title")
 * @param params - Optional parameters to replace in the label (e.g., { name: "World" } for "Hello {{name}}")
 * @returns The label string or the path if not found.
 */
export const locale = (path: string, params?: Record<string, string | number>): any => {
  const keys = path.split(".");
  let current: any = labels;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      console.warn(`Label not found for path: ${path}`);
      return path;
    }
  }

  if (typeof current === "string" && params) {
    return Object.entries(params).reduce(
      (acc: string, [key, value]) => acc.replace(new RegExp(`{{${key}}}`, "g"), String(value)),
      current
    );
  }

  return current;
};
