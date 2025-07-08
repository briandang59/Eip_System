export type TempAssignments = Record<string, Record<string, string>>;

export interface BreakTime {
    start: string;
    end: string;
}

export interface WeekendDay {
    day: number;
    name: string;
}

export interface Period {
    id: number;
    name_en: string;
    name_vn: string;
    name_zh: string;
}

export interface ShiftType {
    id: number;
    tag: string;
    description: string | null;

    start_time: string;
    end_time: string;
    break_time: BreakTime | null;

    location: string;
    active: boolean;

    weekend: WeekendDay[] | null;
    order: number | null;
    allow_auto_overtime: boolean;
    dinner_hours: number;

    period_id: Period;
    color_code: string | null;
    custom_rules: unknown | null;
}

export type ShiftTypeResponseType = Record<string, ShiftType>;

export type ShiftDateResponseType = {
    id: number;
    card_number: string;
    class_id: {
        id: number;
        tag: string;
        order: null;
        active: boolean;
        weekend: null;
        end_time: string;
        location: string;
        period_id: number;
        break_time: null;
        color_code: string;
        start_time: string;
        description: null;
        custom_rules: {
            overtime: {
                c150: [
                    {
                        end: string;
                        start: string;
                        hours_scale: number;
                    },
                    {
                        end: string;
                        start: string;
                        hours_scale: number;
                    },
                ];
            };
        };
        dinner_hours: number;
        allow_auto_overtime: boolean;
    };
    start_date: string;
    end_date: string;
    note: string;
    created_at: string;
    created_by: string;
    updated_at: null;
    updated_by: null;
    active: boolean;
    lock: boolean;
    employee: {
        id_card_number: string;
        id_card_issue_date: null;
        id_card_issue_by: null;
        education_id: number;
        phone_taiwan: null;
        phone_vientnam: null;
        national_id: number;
        marriage_status: null;
        is_pregnant_woman: null;
        has_children: null;
        class_id: number;
        work_description: null;
        job_title_id: number;
        fullname: string;
        fullname_other: string;
        gender: boolean;
        place_of_birth: string;
        birthday: string;
        address: null;
        province: null;
        account_id: null;
        active: boolean;
        work_place_id: number;
        state_id: number;
        join_company_date1: string;
        ethnic_id: null;
        join_company_date2: string;
        uuid: string;
        created_at: string;
        vn_address: {
            ward_id: null;
            district_id: null;
            province_id: null;
        };
        card_number: string;
        is_taking_care_children: boolean;
        employee_state: {
            id: number;
            name_en: string;
            name_vn: string;
            name_zh: string;
        };
        class: {
            id: number;
            created_at: string;
            name_en: string;
            name_zh: string;
            name_vn: string;
            assign_by_user: boolean;
            code: string;
        };
        nation: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
            native_language: number;
            languages: {
                id: number;
                active: boolean;
                name_en: string;
                name_vn: string;
                name_zh: string;
                system_support: boolean;
            };
        };
        job_title: {
            id: number;
            created_at: string;
            name_en: string;
            name_zh: string;
            name_vn: string;
            employee_class: number;
            assign_by_user: boolean;
            code: string;
            order: number;
            active: boolean;
            location: string;
            belongs_to_workplace: number[];
        };
        education: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
            level: number;
            active: boolean;
            created_at: string;
            created_by: null;
            updated_at: null;
            updated_by: null;
        };
        work_place: {
            id: number;
            created_at: string;
            name: string;
            image: null;
            national_id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
            code: string;
            location: string;
            detail_name_en: null;
            detail_name_zh: null;
            detail_name_vn: string;
            address: string;
            active: boolean;
        };
        pregnancy: null;
    };
};
