import { useTranslationCustom } from './useTranslationCustom';

export const useChangeLanguage = (
    name_en: string | null,
    name_zh: string | null,
    name_vn: string | null,
) => {
    const { lang } = useTranslationCustom();
    return lang === 'en' ? name_en : lang === 'zh' ? name_zh : name_vn;
};
