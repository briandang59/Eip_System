export interface TakeLeaveResponseType {
    id: number;
    uuid: string;
    created_at: string; // ISO-8601
    card_number: string;

    start: string; // ISO-8601 date-time
    end: string; // ISO-8601 date-time
    hours: number;
    memo: string;

    vacation_stay_id: number | null;

    leave_type: {
        id: number;
        code: string;
        name_en: string;
        name_vn: string;
        name_zh: string;
        created_at: string;
    };

    substitute_card_number: string | null;
    form_type: string;

    source: {
        system: string;
        method: string;
    };

    scheduled_office_hour: string | null; // e.g. "08:00–17:30"
    usage_year: string;

    vacation_stay: unknown | null; // BE chưa trả về chi tiết

    applicant: {
        fullname: string;
        fullname_other: string;
        card_number: string;
        gender: boolean;
        active: boolean;

        employee_state: {
            id: number;
            name_en: string;
            name_vn: string;
            name_zh: string;
        };

        is_pregnant: boolean | null;
        children: unknown[] | null;

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

        work_place_id: number;

        unit: {
            id: number;
            code: string;
            manager: string | null;
            name_en: string;
            name_vn: string;
            name_zh: string;
            type_id: number;
            class_id: number;
            created_at: string;
            created_by: string | null;
            group_code: string;
            updated_at: string | null;
            updated_by: string | null;
            category_id: number;
            parent_unit_id: number | null;
            staffing_limit: number | null;
            belongs_to_workplace: number[];
            support_employee_class: number[];
            organization_unit_category: {
                id: number;
                name_en: string;
                name_vn: string;
                name_zh: string;
            };
        };
    };

    substitude: Record<string, unknown> | null;
}
