import { RcFile } from 'antd/es/upload';

export type BulletinsCreateRequestType = {
    title_zh: string;
    title_en: string;
    title_vn: string;
    content_zh: string;
    content_en: string;
    content_vn: string;
    start_date: string;
    end_date: string;
    work_places: number[];
    is_global?: boolean;
    is_pinned?: boolean;
    files?: RcFile[];
};

export type BulletinsModifyRequestType = {
    title_zh?: string;
    title_en?: string;
    title_vn?: string;
    content_zh?: string;
    content_en?: string;
    content_vn?: string;
    start_date?: string;
    end_date?: string;
    work_places?: number[];
    is_global?: boolean;
    is_pinned?: boolean;
    files: RcFile[];
};
