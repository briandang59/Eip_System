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
    work_places: string;
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
