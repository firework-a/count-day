import { useState, useEffect, useCallback, useMemo } from 'react';
import { Language, languageList } from '../locales';
import { zhCN, enUS, zhTW, jaJP, koKR } from '../locales';

// 语言资源映射
const resources: Record<Language, { translation: Record<string, string> }> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'zh-TW': zhTW,
  'ja-JP': jaJP,
  'ko-KR': koKR,
};

type TranslateFunction = (key: string) => string;

interface UseTranslationReturn {
  t: TranslateFunction;
  language: Language;
  setLanguage: (lang: Language) => void;
  languageList: typeof languageList;
}

export const useTranslation = (lang?: Language): UseTranslationReturn => {
  const [language, setLanguageState] = useState<Language>(lang || 'zh-CN');

  // 当传入的 lang 变化时，更新内部状态
  useEffect(() => {
    if (lang && lang !== language) {
      setLanguageState(lang);
    }
  }, [lang, language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  // 使用 useMemo 缓存翻译函数，只有 language 变化时才重新创建
  const t: TranslateFunction = useMemo(() => {
    const currentLangTranslations = resources[language]?.translation;
    const zhCNTranslations = resources['zh-CN']?.translation;

    return (key: string) => {
      // 尝试获取当前语言的翻译
      if (currentLangTranslations && key in currentLangTranslations) {
        return currentLangTranslations[key];
      }

      // 如果当前语言没有该翻译，回退到简体中文
      if (zhCNTranslations && key in zhCNTranslations) {
        return zhCNTranslations[key];
      }

      // 如果都没有，返回 key 本身
      return key;
    };
  }, [language]);

  return { t, language, setLanguage, languageList };
};
