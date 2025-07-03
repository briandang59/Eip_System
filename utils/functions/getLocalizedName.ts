export const getLocalizedName = (
    name_en: string,
    name_zh: string,
    name_vn: string,
    lang: string = 'en',
) => {
    return lang === 'en' ? name_en : lang === 'zh' ? name_zh : (name_vn ?? '');
};
