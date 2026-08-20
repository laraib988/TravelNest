import en from '../locales/en.json';
import ja from '../locales/ja.json';
import ur from '../locales/ur.json';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

export const DICTIONARIES: Record<string, Record<string, string>> = {
  en,
  ja,
  ur,
  fr,
  ar
};

/**
 * Resolves a translation string by nested key path (e.g. "header.nav.tours").
 * Falls back to key if not found.
 */
export function getTranslation(locale: string, keyPath: string): string {
  const dictionary = DICTIONARIES[locale] || DICTIONARIES['en'];
  if (!dictionary) return keyPath;
  
  // Directly lookup flat key
  if (dictionary[keyPath]) {
    return dictionary[keyPath];
  }

  // Nested key resolver fallback (if structure becomes nested JSON)
  const segments = keyPath.split('.');
  let current: any = dictionary;
  for (const segment of segments) {
    if (current && typeof current === 'object' && current[segment] !== undefined) {
      current = current[segment];
    } else {
      return keyPath;
    }
  }

  return typeof current === 'string' ? current : keyPath;
}
