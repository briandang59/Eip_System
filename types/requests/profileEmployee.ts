export type CreateEmployeeRequest = {
    fullname: string;
    work_place_id: number;
    employee: {
        card_number: string;
        fullname: string;
        fullname_other: string;
        gender: boolean;
        national_id: number;
        education_id: number;
        phone_vientnam: string;
        phone_taiwan: string;
        id_card_number: string;
        id_card_issue_by: string;
        id_card_issue_date: string;
        ethnic_id: number;
        place_of_birth: string;
        marriage_status: string;
        is_pregnant_woman: boolean;
        is_taking_care_children: boolean;
        has_children: number;
        class_id: number;
        join_company_date1: string;
        join_company_date2: string;
        vn_address: {
            province_id: string;
            district_id: string;
            ward_id: string;
        };
        unit_id: number;
        job_title_id: number;
        work_description: string;
        active: boolean;
        province: string;
        birthday: string;
    };
    languages: number[];
    insurance: {
        join_date: string;
        initial_deduction_date: string;
        refusal_insurance: boolean;
        refusal_reason: string;
    };
    contract: {
        effect_date: string;
        expir_date: string;
        type_id: number;
    };
    visa: {
        passport_number: string | null;
        passport_issue_date: string | null;
        passport_expiration_date: string | null;
        work_permit_number: string | null;
        work_permit_expiration_date: string | null;
        visa_number: string | null;
        visa_type_id: number | null;
        visa_expiration_date: string | null;
        visa_effective_date: string | null;
        visa_duration_stay: number | null;
        visa_note: string | null;
    };
    shift: {
        shift_id: number;
        start: string;
        end: string;
    };
};
