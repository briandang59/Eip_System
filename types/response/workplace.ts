export interface WorkPlaceResponse {
    id: number;
    created_at: string;
    name: string;
    image: string | null;
    national_id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
    code: string;
    location: string;
    detail_name_en: string | null;
    detail_name_zh: string | null;
    detail_name_vn: string;
    address: string;
    active: boolean;
}
