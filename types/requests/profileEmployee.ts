export type CreateEmployeeRequest = {
    fullname: string | null;
    work_place_id: number | null;
    employee: {
        card_number: string | null;
        fullname: string | null;
        fullname_other: string | null;
        gender: boolean;
        national_id: number | null;
        education_id: number | null;
        phone_vientnam: string | null;
        phone_taiwan: string | null;
        id_card_number: string | null;
        id_card_issue_by: string | null;
        id_card_issue_date: string | null;
        ethnic_id: number | null;
        place_of_birth: string | null;
        marriage_status: string | null;
        is_pregnant_woman: boolean | null;
        is_taking_care_children: boolean | null;
        has_children: number | null;
        class_id: number | null;
        join_company_date1: string | null;
        join_company_date2: string | null;
        vn_address: {
            province_id: string | null;
            district_id: string | null;
            ward_id: string | null;
        };
        unit_id: number | null;
        job_title_id: number | null;
        work_description: string | null;
        active: boolean;
        province: string | null;
        birthday: string | null;
    };
    languages: number[] | null;
    insurance: {
        join_date: string | null;
        initial_deduction_date: string | null;
        refusal_insurance: boolean;
        refusal_reason: string | null;
    };
    contract: {
        effect_date: string | null;
        expir_date: string | null;
        type_id: number | null;
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
        shift_id: number | null;
        start: string | null;
        end: string | null;
    };
    has_child: {
        start_date: string | null;
        end_date: string | null;
    };
    pregnancy: {
        start_date: string | null;
        end_date: string | null;
    };
};
