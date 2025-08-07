export type CareerHistoryResponseType = {
    id: number;
    service_unit: {
        id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
    };
    job_title: {
        id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
    };
    memo: string;
    event_date: string;
    uuid: string;
    event_id: number;
    card_number: string;
    work_place: {
        id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
    };
    job_class: {
        id: number;
        created_at: string;
        name_en: string;
        name_zh: string;
        name_vn: string;
        assign_by_user: boolean;
        code: string;
    } | null;
    created_at: string;
    reason: {
        id: number;
        name_en: string;
        name_vn: string;
        name_zh: string;
    } | null;
    career_event: {
        id: number;
        name_en: string;
        name_vn: string;
        name_zh: string;
    };
};
