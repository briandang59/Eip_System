export type EthnicResponseType = {
    id: number;
    created_at: string;
    name: string;
    nation_id: number;
    nation: {
        id: number;
        name_en: string;
        name_vn: string;
        name_zh: string;
        native_language: number;
    };
};
