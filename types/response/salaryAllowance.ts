import { I_INSURANCE } from '../printing/IEmployee';

export interface JobTitle {
    id: number;
    created_at: string; // ISO date string
    name_en: string | null;
    name_zh: string | null;
    name_vn: string | null;
    employee_class: number;
    assign_by_user: boolean;
    code: string | null;
    order: number | null;
    active: boolean;
    location: string;
    belongs_to_workplace: number[];
}

export interface Unit {
    id: number;
    code: string | null;
    manager: string | null;
    name_en: string | null;
    name_vn: string | null;
    name_zh: string | null;
    type_id: number;
    class_id: number;
    created_at: string; // ISO date string
    created_by: string | null;
    group_code: string | null;
    updated_at: string | null;
    updated_by: string | null;
    category_id: string | null;
    parent_unit_id: number | null;
    staffing_limit: string | null;
    belongs_to_workplace: number[];
    support_employee_class: number[];
    organization_unit_category: string | null;
}

export interface Employee {
    card_number: string;
    fullname: string;
    gender: boolean;
    birthday: string | null;
    place_of_birth: string | null;
    id_card_number: string | null;
    id_card_issue_date: string | null;
    id_card_issue_by: string | null;
    uuid: string;
    join_company_date1: string | null;
    join_company_date2: string | null;
    job_title: JobTitle;
    unit: Unit;
}

export type SalaryAllowance = {
    employee: {
        card_number: string;
        fullname: string;
        uuid: string;
        join_company_date1: string;
        join_company_date2: string;
        job_title: JobTitle;
        unit: Unit | null;
    };
    social_insurance: I_INSURANCE | null;
    probationary_salary: null | {
        id: number;
        uuid: string;
        salary: number;
        currency_unit: any;
        created_at: string;
        created_by: string;
    };
    base_salary: {
        id: number;
        uuid: string;
        salary: number;
        currency_unit: string;
        created_at: string;
        created_by: string;
        updated_at: null | string;
        updated_by: null | string;
    } | null;
    allowance: null | Allowance | Allowance[];
    contract: Icontract | null;
    kpi: null;
};
export interface Allowance {
    id: number;
    uuid: string;
    allowance_id: number;
    amount: number;
    currency_unit: string;
    active: boolean;
    created_at: string;
    created_by: string;
    updated_at: null | string;
    updated_by: null | string;
}
export interface Icontract {
    id?: number;
    card_number: string;
    effect_date: string;
    expir_date: string;
    type_id?: null | number;
    created_at?: string;
    created_by?: null | string;
}
