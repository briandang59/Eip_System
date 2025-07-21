export type MeetingRoomResponseType = {
    id: number;
    active: boolean;
    work_place_id: number;
    created_at: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    note: string | null;
};

export type MeetingTypeResponseType = {
    id: number;
    created_at: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    active: boolean;
};
