export type NationResponseType = {
    id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
    native_language: number;
    languages: {
        id: number;
        active: boolean;
        name_en: string;
        name_vn: string;
        name_zh: string;
        system_support: boolean;
    };
};
