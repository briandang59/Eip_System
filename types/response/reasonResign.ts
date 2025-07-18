export type ReasonResignResponseType = {
    class_id: number;
    class_name_en: string;
    class_name_zh: string;
    class_name_vn: string;
    reason_list: ReasonDetailType[];
};

export type ReasonDetailType = {
    id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
};
