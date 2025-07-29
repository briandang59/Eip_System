export interface WorkPlace {
    id: number;
    code: string;
    name: string;
    image: string | null;
    active: boolean;
    address: string;
    name_en: string;
    name_vn: string;
    name_zh: string;
    location: string;
    created_at: string;
    national_id: number;
    detail_name_en: string | null;
    detail_name_vn: string | null;
    detail_name_zh: string | null;
}

export interface Role {
    id: number;
    tag: string;
    name_en: string;
    name_vn: string;
    name_zh: string;
    created_at: string;
    description: string;
    work_places: WorkPlace[];
}

export interface PermissionWorkPlace {
    id: number;
    code: string;
    name_en: string;
}

export interface PermissionMap {
    permission_create: PermissionWorkPlace[];
    permission_update: PermissionWorkPlace[];
    permission_delete: PermissionWorkPlace[];
    role_create: PermissionWorkPlace[];
    role_update: PermissionWorkPlace[];
    role_delete: PermissionWorkPlace[];
    role_bind_permission: PermissionWorkPlace[];
    role_unbind_permission: PermissionWorkPlace[];
    account_bind_role: PermissionWorkPlace[];
    account_unbind_role: PermissionWorkPlace[];
    hr_dayoff_list_read: PermissionWorkPlace[];
    hr_dayoff_list_create: PermissionWorkPlace[];
    recruit_interview_read: PermissionWorkPlace[];
    recruit_interview_create: PermissionWorkPlace[];
    recruit_interview_update: PermissionWorkPlace[];
    recruit_apply: PermissionWorkPlace[];
    recruit_close: PermissionWorkPlace[];
    talent_bank_read: PermissionWorkPlace[];
    talent_bank_create: PermissionWorkPlace[];
    talent_bank_update: PermissionWorkPlace[];
    talent_bank_delete: PermissionWorkPlace[];
    member_data_read: PermissionWorkPlace[];
    hr_shift_list_create: PermissionWorkPlace[];
    hr_shift_list_read: PermissionWorkPlace[];
    hr_shift_list_update: PermissionWorkPlace[];
    hr_daily_shift_read: PermissionWorkPlace[];
    hr_daily_shift_update: PermissionWorkPlace[];
    hr_daily_shift_delete: PermissionWorkPlace[];
    hr_daily_promotion: PermissionWorkPlace[];
    hr_transfer_create: PermissionWorkPlace[];
    hr_daily_resign: PermissionWorkPlace[];
    hr_career_list_read: PermissionWorkPlace[];
    hr_attendance_read: PermissionWorkPlace[];
    hr_dayoff_list_update: PermissionWorkPlace[];
    basic_dormitory_create: PermissionWorkPlace[];
    basic_dormitory_read: PermissionWorkPlace[];
    basic_dormitory_update: PermissionWorkPlace[];
    hr_daily_shift_create: PermissionWorkPlace[];
    org_unit_read: PermissionWorkPlace[];
    org_unit_create: PermissionWorkPlace[];
    org_unit_update: PermissionWorkPlace[];
    org_unit_allocate_member: PermissionWorkPlace[];
    org_member_create: PermissionWorkPlace[];
    org_member_update: PermissionWorkPlace[];
    org_member_delete: PermissionWorkPlace[];
    org_member_assign_supervisor: PermissionWorkPlace[];
    hr_dayoff_list_delete: PermissionWorkPlace[];
    booking_meeting_read: PermissionWorkPlace[];
    my_booking_meeting_update: PermissionWorkPlace[];
    my_booking_meeting_delete: PermissionWorkPlace[];
    booking_meeting_create: PermissionWorkPlace[];
}

export interface UserInfo {
    id_card_number: string;
    id_card_issue_date: string | null;
    id_card_issue_by: string | null;
    education_id: number | null;
    phone_taiwan: string | null;
    phone_vientnam: string;
    national_id: number;
    marriage_status: boolean | null;
    is_pregnant_woman: boolean;
    has_children: boolean | null;
    class_id: number;
    work_description: string | null;
    job_title_id: number;
    fullname: string;
    fullname_other: string;
    gender: boolean;
    place_of_birth: string | null;
    birthday: string;
    address: string | null;
    province: string | null;
    account_id: number;
    active: boolean;
    work_place_id: number;
    state_id: number;
    join_company_date1: string;
    ethnic_id: number | null;
    join_company_date2: string;
    uuid: string;
    created_at: string;
    vn_address: {
        ward_id: number | null;
        district_id: number | null;
        province_id: number | null;
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
    education: any | null;
    work_place: WorkPlace;
    pregnancy: any | null;
}

export interface AuthResponse {
    token: string;
    expiredIn: string;
    user_info: UserInfo;
    class: string;
    roles: Role[];
    permission_map: PermissionMap;
    preferences: {
        language: string;
    };
}

export interface AuthSignInRequest {
    account: string;
    password: string;
}
