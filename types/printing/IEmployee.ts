export interface IEmployee {
    card_number: string;
    created_at: string;
    fullname: string;
    fullname_other: string;
    gender: boolean | number;
    place_of_birth: string | null;
    birthday: string | null;
    address: string | null;
    province: string | null;
    work_place_id: number;
    active: boolean;
    account_id: string | null;
    id_card_number: string | null;
    id_card_issue_date: string | null;
    id_card_issue_by: string | null;
    education_id: string | null;
    phone_taiwan: string | null;
    phone_vientnam: string | null;
    national_id: number;
    marriage_status: string | number | null;
    is_pregnant_woman: boolean | number | null;
    is_children: boolean | number | null;
    total_children: number;
    class_id: number;
    work_description: string | null;
    job_title_id: number;
    ethnic_id: string | null;
    vn_address: VN_ADDRESS | null;
    join_company_date1: string | null;
    join_company_date2: string | null;
    state_id: number | null;
    uuid: string;
    employee_state: EMPLOYEE_STATUS;
    class: CLASSTYPE;
    nation: NATIONAL;
    job_title: JOINTITLE;
    education: EDUCATION | null;
    work_place: WORKPLACE;
    has_children: number;
    custom_data: string | null;
    pregnancy: {
        id: number;
        start_date: string;
        end_date: string | null;
    } | null;
    take_care_of_child: {
        id: number;
        start_date: string;
        end_date: string | null;
    } | null;
    speak_languages: SPEAK_LANGUAGES[] | SPEAK_LANGUAGES | null;
    visa: I_VISA | null;
    insurance: I_INSURANCE | null;
    refusal_insurance: REFUSAL_INSURANCE | null;
    contract: ICONTRACT[] | ICONTRACT | null;
    unit: I_UNIT | null;
    ethnic: ETHNIC | null;
    resign_record?: {
        date: string;
        reason: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
        };
    };
    shift: {
        shift_id: number;
        tag: string;
        start_date: string;
        end_date: string;
        office_hour: {
            clock_in: string;
            clock_out: string;
        };
    };
}

export interface VN_ADDRESS {
    ward_id: string | null;
    district_id: string | null;
    province_id: string | null;
}

export interface EMPLOYEE_STATUS extends GENDER {}

export interface GENDER {
    id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
}

export interface SPEAK_LANGUAGES {
    id: number;
    created_at: string;
    card_number: string;
    language_id: number;
    note: string;
    languages: LANGUAGE;
}

export interface LANGUAGE {
    id: number;
    created_at: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    active: boolean;
    system_support: boolean;
}

export interface CLASSTYPE {
    id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
    assign_by_user: boolean;
    code: string;
}

export interface I_VISA {
    id?: number;
    card_number: string | null;
    passport_number: string;
    passport_issue_date: string;
    passport_expiration_date: string;
    work_permit_number: string;
    work_permit_expiration_date: string;
    visa_number: string;
    visa_type_id: number;
    visa_type?: {
        visa_type: {
            id: number;
            name: string;
            issuing_country: number;
        };
    };
    visa_expiration_date: string;
    visa_duration_stay: number;
    visa_effective_date: string;
    note: string;
    created_at?: string;
}

export interface ETHNIC {
    id: number;
    created_at: string;
    name: string;
    nation_id: number;
    nation: {
        id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
        native_language: number;
    };
}

export interface I_INSURANCE {
    id?: number;
    card_number: string;
    join_date: string;
    initial_deduction_date: string;
    created_at?: string;
    note?: string;
    social_insurance_code?: string | null;
}

export interface REFUSAL_INSURANCE {
    id: number;
    card_number: string;
    refusal_reason: string;
    created_at: string;
}

export interface NATIONAL {
    id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
    native_language: number;
    languages: LANGUAGE;
}

export interface JOINTITLE {
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
}

export interface EDUCATION {
    id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
    level: number;
}

export interface WORKPLACE {
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
}

export interface ICONTRACT {
    id?: number;
    card_number: string;
    effect_date: string;
    expir_date: string;
    type_id?: null | number;
    created_at?: string;
    created_by?: null | string;
}

export interface I_UNIT {
    id: number;
    created_at: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    type_id: number;
    staffing_limit: number | null;
    manager?: string;
    code: string;
    employee_class_id: number;
    belongs_to_workplace: number[];
    parent_unit_id: any;
    class_id: number;
    created_by: any;
    updated_at: any;
    updated_by: any;
    group_code: any;
    category_id: number | null;
    organization_unit_type?: {
        id: number;
        name_en: string | null;
        name_vn: string | null;
        name_zh: string | null;
    };
    organization_unit_category?: {
        id: number;
        name_en: string | null;
        name_vn: string | null;
        name_zh: string | null;
    };
    full_title_en: string;
    full_title_zh: string;
    full_title_vn: string;
    manager_obj: any;
}
