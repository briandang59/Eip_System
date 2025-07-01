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
                    T1: {
                        system: string;
                        method: string;
                        face_photo: string;
                        time: string;
                    };
                    T2: {
                        time: null;
                    };
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
                    E: number;
                    F: number;
                    G: number;
                    H: number;
                    I: number;
                };
                KP: number;
                T1: {
                    system: string;
                    method: string;
                    face_photo: string;
                    time: string;
                };
                T2: {
                    time: null;
                };
            };
            holiday: null;
            shift: {
                tag: string;
                start_time: string;
                end_time: string;
                color_code: null;
            };
        },
    ];
};
