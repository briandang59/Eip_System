export type PermisisonITResponse = {
    id: number;
    created_at: string;
    description: string;
    type_id: number;
    tag: string;
    permission_type: {
        id: number;
        name_en: string;
        name_vn: string;
        name_zh: string;
        created_at: string;
    };
};
