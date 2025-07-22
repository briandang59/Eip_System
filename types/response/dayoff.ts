export type Language = {
    id: number;
    active: boolean;
    name_en: string;
    name_vn: string;
    name_zh: string;
    system_support: boolean;
};

export type Nation = {
    id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
    native_language: number;
    languages: Language;
};

export type EmployeeState = {
    id: number;
    name_en: string;
    name_vn: string;
    name_zh: string;
};

export type EmployeeClass = {
    id: number;
    created_at: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    assign_by_user: boolean;
    code: string;
};

export type JobTitle = {
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

export type OrganizationUnitCategory = {
    id: number;
    name_en: string | null;
    name_vn: string;
    name_zh: string;
};

export type Unit = {
    id: number;
    code: string;
    manager: null;
    name_en: string;
    name_vn: string;
    name_zh: string;
    type_id: number;
    class_id: number;
    created_at: string;
    created_by: null;
    group_code: null;
    updated_at: string | null;
    updated_by: null;
    category_id: number;
    parent_unit_id: number;
    staffing_limit: null;
    belongs_to_workplace: number[];
    support_employee_class: number[];
    organization_unit_category: OrganizationUnitCategory;
};

export type Applicant = {
    fullname: string;
    fullname_other: string;
    card_number: string;
    gender: boolean;
    active: boolean;
    employee_state: EmployeeState;
    is_pregnant: boolean | null;
    children: number | null;
    class: EmployeeClass;
    nation: Nation;
    job_title: JobTitle;
    work_place_id: number;
    unit: Unit;
};

export type LeaveType = {
    id: number;
    code: string;
    name_en: string;
    name_vn: string;
    name_zh: string;
    created_at: string;
};

export type OvertimeRule = {
    end: string;
    start: string;
    checkout?: string;
    hours_scale?: number;
};

export type CustomRules = {
    overtime: {
        G210?: OvertimeRule[];
        c150?: OvertimeRule[];
    };
};

export type ScheduledOfficeHour = {
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
    custom_rules: CustomRules;
    dinner_hours: number;
    allow_auto_overtime: boolean;
};

export type DayoffType = {
    id: number;
    uuid: string;
    created_at: string;
    card_number: string;
    start: string;
    end: string;
    hours: number;
    memo: string;
    vacation_stay_id: null;
    leave_type: LeaveType;
    substitute_card_number: null;
    form_type: string;
    source: {
        system: string;
        method: string;
    };
    scheduled_office_hour: ScheduledOfficeHour;
    usage_year: string;
    vacation_stay: null;
    applicant: Applicant;
    substitude: Record<string, never>;
};
