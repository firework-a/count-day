// 语言类型定义
export type Language = 'zh-CN' | 'en-US' | 'zh-TW' | 'ja-JP' | 'ko-KR';

// 翻译资源结构
export interface TranslationResource {
  translation: Record<string, string>;
}

// 语言元数据
export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
}

// 语言列表
export const languageList: LanguageMeta[] = [
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文' },
  { code: 'en-US', name: 'English', nativeName: 'English' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어' },
];
