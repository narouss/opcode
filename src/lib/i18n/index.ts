import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

// i18n 资源
const resources = {
    'zh-CN': {
        translation: zhCN,
    },
    en: {
        translation: en,
    },
};

// 初始化 i18next
i18n
    .use(LanguageDetector) // 自动检测语言
    .use(initReactI18next) // 集成 React
    .init({
        resources,
        fallbackLng: 'zh-CN', // 默认语言为中文
        lng: 'zh-CN', // 初始语言
        debug: false,
        interpolation: {
            escapeValue: false, // React 已经处理 XSS
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
    });

export default i18n;
