export type BulletinsResponseType = {
    id: string;
    created_at: string;
    updated_at: string;
    title_zh: string;
    title_en: string;
    title_vn: string;
    content_zh: string;
    content_en: string;
    content_vn: string;
    active: boolean;
    start_date: string;
    end_date: string;
    work_places: number[];
    departments_details: {
        id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
        code: string;
    }[];
    target_employee_details: {
        card_number: string;
        fullname: string;
        fullname_other: string;
        gender: boolean;
        work_place_id: number;
        active: boolean;
        uuid: string;
    }[];
    is_global: boolean;
    is_pinned: boolean;
    attachments: AttachmentsResponseType[];
};

export type AttachmentsResponseType = {
    id: string;
    bulletin_uuid: string;
    file_name: string;
    nas_path: string;
};
