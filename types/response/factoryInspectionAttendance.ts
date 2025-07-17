export type FactoryInspectionAttendance = {
    fullname: string;
    card_number: string;
    unit: Unit;
    pregnancy?: {
        start_date?: string | null;
        end_date?: string | null;
    } | null;
    has_children?: {
        start_date?: string | null;
        end_date?: string | null;
    } | null;
    join_company_date1: string;
    employee_class: EmployeeClass;
    resign_date: null | string;
    active: boolean;
    details: EmployeeDetail[];
};

interface Unit {
    id: number;
    code: string;
    name_en: string | null;
    name_zh: string;
    name_vn: string;
    organization_unit_category: OrganizationUnitCategory;
}

interface OrganizationUnitCategory {
    id: number;
    name_en: null | string;
    name_vn: string;
    name_zh: string;
}

interface EmployeeClass {
    id: number;
    name_en: string;
    name_zh: string;
    name_vn: string;
    code: string;
}

interface EmployeeDetail {
    date: string; // Ngày dạng chuỗi ISO (ví dụ: "2025-07-01")
    card_number: string;
    employee_class_code: string;
    unit: Unit;
    work_place_id: number;
    attendance: Attendance[];
    workday: Workday;
    holiday: null | string; // Có thể null hoặc chuỗi
    shift: Shift;
}

interface Attendance {
    id: number;
    clockin: string; // Thời gian dạng ISO (ví dụ: "2025-07-01T00:45:36+00:00")
    clockout: string; // Thời gian dạng ISO
    T1: TimeRecord;
    T2: TimeRecord;
    is_abnormal: boolean;
    abnormal_processing: boolean;
}

interface TimeRecord {
    system: string; // Ví dụ: "hikvision"
    method: string; // Ví dụ: "Face"
    face_photo: string; // Đường dẫn hoặc định dạng Vsm://
    time: string; // Thời gian dạng ISO
}

interface Workday {
    GC: number; // Giờ làm việc chính
    overtime: Overtime;
    nle: number;
    GDem: number;
    G200: number;
    G210: number;
    KP: number;
    DT: number;
    VS: number;
    Tcom: number;
    leave_hours: LeaveHours;
    T1: TimeRecord;
    T2: TimeRecord;
}

interface Overtime {
    c150: number;
    c200: number;
    c300: number;
    c390: number;
}

interface LeaveHours {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
    G: number;
    H: number;
    I: number;
}

interface Shift {
    tag: string; // Ví dụ: "C22"
    start_time: string; // Ví dụ: "09:00"
    end_time: string; // Ví dụ: "17:00"
    color_code: string; // Mã màu hex (ví dụ: "6CE698")
}
