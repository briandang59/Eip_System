export type DailyStatisticalAttendance = {
    unit: {
        id: number;
        code: string;
        manager: string;
        name_en: string;
        name_vn: string;
        name_zh: string;
        type_id: number;
        class_id: number;
        created_at: string;
        created_by: null;
        group_code: null;
        updated_at: null;
        updated_by: null;
        category_id: number;
        parent_unit_id: number;
        staffing_limit: null;
        belongs_to_workplace: number[];
        support_employee_class: number[];
        organization_unit_category: {
            id: number;
            name_en: string | null;
            name_vn: string | null;
            name_zh: string | null;
        };
    };
    unit_employee_num: number;
    day_shift_num: number;
    after_noon_shift_number: number;
    night_shift_num: number;
    dayoff_employee_num: number;
    attendance_employee_num: number;
    absence_without_leave_num: number;
    day_shift: ShiftStatisticalAttendance;
    afternoon_shift: ShiftStatisticalAttendance;
    night_shift: ShiftStatisticalAttendance;
};

type ShiftStatisticalAttendance = {
    total_employee: number;
    actual_attendance: number;
    total_take_leave: number;
    absence_without_leave_num: number;
    percentage: string;
};

export type RangeDateStatisticalAttendance = {
    date: string;
    statistic_data: Record<string, DailyStatisticalAttendance>;
};
