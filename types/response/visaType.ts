export type VisaTypeResponseType = {
    id: number;
    name: string;
    issuing_country: number;
    nation: {
        id: number;
        name_en: string;
        name_vn: string;
        name_zh: string;
        native_language: number;
    };
};
