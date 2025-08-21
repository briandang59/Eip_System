export interface TimeUpdate {
    user_update: boolean;
    update_time: string;
    system: string;
    method: string;
    face_photo: string;
    reason: {
        id: number;
        reason_en: string;
        reason_zh: string;
        reason_vn: string;
    };
    time: string;
    work_place_id: number;
}
export interface TimeNormal {
    system: string;
    method: string;
    face_photo: string;
    time: string;
    work_place_id: number;
}
export interface BreakTime {
    start: string;
    end: string;
}
export type AttendanceV2Type = {
    fullname: string;
    card_number: string;
    unit: {
        id: number;
        code: string;
        name_en: string;
        name_zh: string;
        name_vn: string;
        organization_unit_category: {
            id: number;
            name_en: string;
            name_vn: string;
            name_zh: string;
        };
    };
    pregnancy: {
        id: number;
        employee_uuid: string;
        start_date: string;
        end_date: string | null;
        created_at: string;
    };
    has_children: {
        id: number;
        employee_uuid: string;
        start_date: string;
        end_date: string | null;
    };
    join_company_date1: string;
    employee_class: {
        id: number;
        name_en: string;
        name_zh: string;
        name_vn: string;
        code: string;
    };
    resign_date: null;
    active: true;
    details: [
        {
            date: string;
            card_number: string;
            employee_class_code: string;
            unit: {
                id: number;
                code: string;
                name_en: string;
                name_zh: string;
                name_vn: string;
                organization_unit_category: {
                    id: number;
                    name_en: string;
                    name_vn: string;
                    name_zh: string;
                };
            };
            work_place_id: number;
            attendance: [
                {
                    id: number;
                    clockin: string;
                    clockout: null;
                    T1: TimeNormal | TimeUpdate;
                    T2: TimeNormal | TimeUpdate;
                    is_abnormal: false;
                    abnormal_processing: false;
                },
            ];
            workday: {
                GC: number;
                overtime: {
                    c150: number;
                    c200: number;
                    c300: number;
                    c390: number;
                    c400: number;
                };
                nle: number;
                GDem: number;
                G200: number;
                G210: number;
                DT: number;
                VS: number;
                Tcom: number;
                leave_hours: {
                    A: number;
                    B: number;
                    C: number;
                    D: number;
                    DB: number;
                    CV: number;
                };
                KP: number;
                T1: TimeNormal | TimeUpdate;
                T2: TimeNormal | TimeUpdate;
            };
            holiday: null;
            shift: {
                tag: string;
                start_time: string;
                end_time: string;
                color_code: string;
                is_night_shift: {
                    tag: string;
                    start_time: string;
                    end_time: string;
                    color_code: string;
                    is_night_shift: boolean;
                };
            } | null;
        },
    ];
};

export type StatisticalWorkdayType = {
    card_number: string;
    fullname: string;
    unit: {
        id: number;
        code: string;
        name_en: string | null;
        name_zh: string | null;
        name_vn: string | null;
    };
    total_GC: number;
    total_NLE: number;
    total_150: number;
    total_200: number;
    total_300: number;
    total_390: number;
    total_400: number;
    total_A: number;
    total_B: number;
    total_KP: number;
    total_C: number;
    total_DB: number;
    total_CV: number;
    total_DT: number;
    total_VS: number;
    total_G200: number;
    total_G210: number;
    total_Gdem: number;
    total_CCAN: number;
    total_Tcom: number;
    total_MonthH: number;
    total_HChuan: number;
    total_SGC: number;
    total_AllH: number;
    month: string;
};

export type AttendanceModifyReasonList = {
    id: number;
    reason_en: string;
    reason_zh: string;
    reason_vn: string;
};
