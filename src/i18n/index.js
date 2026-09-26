import ja from './ja.json';
import en from './en.json';

const dictionaries = { ja, en };
let currentLang = 'ja'; // デフォルト日本語

export function setLanguage(lang) {
  if (dictionaries[lang]) {
    currentLang = lang;
  }
}

export function getLanguage() {
  return currentLang;
}

export function t(keyPath, params = {}, defaultText = '') {
  const keys = keyPath.split('.');
  let current = dictionaries[currentLang] || dictionaries['ja'];
  
  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      let fallback = dictionaries['en'];
      for (const fk of keys) {
        if (fallback && fallback[fk] !== undefined) {
          fallback = fallback[fk];
        } else {
          return defaultText || keyPath;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current === 'string') {
    let result = current;
    for (const pKey in params) {
      result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
    }
    return result;
  }

  return current || defaultText || keyPath;
}

export default { t, setLanguage, getLanguage };
