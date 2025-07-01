export type WorkPlaceType = {
    id: number;
    code: string;
    name: string;
    image: string | null;
    active: boolean;
    address: string;
    name_en: string;
    name_vn: string;
    name_zh: string;
    location: string;
    created_at: string;
    national_id: number;
    detail_name_en: string | null;
    detail_name_vn: string;
    detail_name_zh: string | null;
};
export type RoleType = {
    id: number;
    tag: string;
    name_en: string;
    name_vn: string;
    name_zh: string;
    created_at: string;
    description: string;
    work_places: WorkPlaceType[];
};
