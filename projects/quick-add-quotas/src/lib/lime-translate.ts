import { text2key } from "./text2key";

const warn = (...args: any[]): void => console.warn('[LimeTranslate]', ...args);
const missingTranslation = (key: string): void => {
  (window as any).qaqMissingTranslations ||= [];
  if ((window as any).qaqMissingTranslations.includes(key)) return;
  (window as any).qaqMissingTranslations.push(key);
  warn(`Missing translation for key: ${key}`);
}

export const limeTranslate = (value: string | undefined, translations: Record<string, string> | undefined): string => {
  const key = text2key(value);

  if (
    !(value && typeof value == 'string' && value.length > 0) ||
    !translations
  ) return value ?? '';

  if (!translations[key]) {
    missingTranslation(value);
    return value;
  }

  return translations[key];
}