import { useTranslationCustom } from './useTranslationCustom';

export const useChangeLanguage = (name_en: string, name_zh: string, name_vn: string) => {
    const { lang } = useTranslationCustom();
    return lang === 'en' ? name_en : lang === 'zh' ? name_zh : (name_vn ?? '');
};
