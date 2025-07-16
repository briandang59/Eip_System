export type EmployeeResponseType = {
    id_card_number: string;
    id_card_issue_date: string | null;
    id_card_issue_by: string | null;
    education_id: number;
    phone_taiwan: string | null;
    phone_vietnam: string | null; // Corrected typo from 'phone_vientnam'
    national_id: number;
    marriage_status: boolean | null; // Changed to string | null to match JSON ('on' or null)
    is_pregnant_woman: boolean | null; // Changed to allow null as per JSON
    has_children: number | null; // Changed to allow null as per JSON
    class_id: number;
    work_description: string | null;
    job_title_id: number;
    fullname: string;
    fullname_other: string | null;
    gender: boolean;
    place_of_birth: string;
    birthday: string;
    address: string | null;
    province: string | null;
    account_id: string | null;
    active: boolean;
    work_place_id: number;
    state_id: number;
    join_company_date1: string;
    ethnic_id: number | null; // Changed to allow null as per JSON
    join_company_date2: string;
    uuid: string;
    created_at: string;
    vn_address: {
        ward_id: string | null; // Changed to allow null as per JSON
        district_id: string | null; // Changed to allow null as per JSON
        province_id: string | null; // Changed to allow null as per JSON
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
        created_by: string | null;
        updated_at: string | null;
        updated_by: string | null;
    };
    work_place: {
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
    };
    pregnancy: {
        start_date: string | null;
        end_date: string | null;
    } | null; // Changed to allow null and structured as an object
    speak_languages: {
        id: number;
        created_at: string;
        card_number: string;
        language_id: number;
        note: string | null;
        languages: {
            id: number;
            active: boolean;
            name_en: string;
            name_vn: string;
            name_zh: string;
            system_support: boolean;
        };
    } | null;
    take_care_of_child: {
        start_date: string | null;
        end_date: string | null;
    } | null;
    insurance: {
        id: number;
        card_number: string;
        created_at: string;
        join_date: string | null; // Adjusted to allow null
        initial_deduction_date: string | null;
        note: string | null;
        social_insurance_code: string | null;
    } | null;
    refusal_insurance: null; // As per JSON, always null in provided data
    contract: {
        id: number;
        card_number: string;
        effect_date: string | null; // Adjusted to allow null
        created_at: string;
        created_by: string | null;
        type_id: number; // Changed to number to match JSON
        expir_date: string | null;
    } | null; // Changed to allow null
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
        group_code: string | null;
        updated_at: string | null;
        updated_by: string | null;
        category_id: number;
        parent_unit_id: number | null; // Adjusted to allow null as per JSON
        staffing_limit: number | null;
        belongs_to_workplace: number[];
        support_employee_class: number[];
        organization_unit_category: {
            id: number;
            name_en: string;
            name_vn: string;
            name_zh: string;
        };
    } | null; // Changed to allow null
    ethnic: {
        id: number;
        created_at: string;
        name: string;
        nation_id: number;
        nation: {
            id: number;
            name_en: string;
            name_vn: string;
            name_zh: string;
            native_language: number;
        };
    } | null; // Changed to allow null as per JSON
    shift: {
        id: number;
        name_en: string;
        name_vn: string;
        name_zh: string;
    } | null; // Changed to allow null as per JSON
};
