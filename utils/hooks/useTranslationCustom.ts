import { useEffect } from 'react';
import en from '@/i18n/en.json';
import vn from '@/i18n/vn.json';
import zh from '@/i18n/zh.json';
import { useLanguageStore } from '@/stores/useLanguageStore';

const translations = { en, vn, zh };

export const useTranslationCustom = () => {
    const lang = useLanguageStore((state) => state.language);
    const setLanguage = useLanguageStore((state) => state.setLanguage);
    const hydrate = useLanguageStore((state) => state.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const t = translations[lang] ?? translations['en'];

    return { t, lang, setLanguage };
};
