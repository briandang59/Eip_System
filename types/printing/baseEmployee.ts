export type BasicEmployee = {
    card_number: string;
    photo: string | null;
    fullname: string;
    class: {
        id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
        assign_by_user: boolean;
        code: string;
    };
    gender: boolean;
    join_company_date: string;
    join_company_date2: string;
    job_title: {
        id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
        order: string;
        code: string;
        employee_class: number;
        assign_by_user: boolean;
        active: boolean;
        location: string;
        belongs_to_workplace: number[];
    };
    work_place: {
        id: number;
        created_at: string;
        name: string;
        image: string;
        national_id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
        code: string;
        location: string;
        detail_name_en: null | string;
        detail_name_zh: null | string;
        detail_name_vn: string | null;
        address: string | null;
    };
    organization_unit: {
        id: number;
        code: string;
        name_en: string;
        name_vn: string;
        name_zh: string;
        parent_unit_id: number;
    };
};
