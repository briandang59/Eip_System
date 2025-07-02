export interface BreakTime {
    start: string;
    end: string;
}

export interface WeekendDay {
    day: number;
    name: string;
}

export interface Period {
    id: number;
    name_en: string;
    name_vn: string;
    name_zh: string;
}

export interface ShiftType {
    id: number;
    tag: string;
    description: string | null;

    start_time: string;
    end_time: string;
    break_time: BreakTime | null;

    location: string;
    active: boolean;

    weekend: WeekendDay[] | null;
    order: number | null;
    allow_auto_overtime: boolean;
    dinner_hours: number;

    period_id: Period;
    color_code: string | null;
    custom_rules: unknown | null;
}

export type ShiftTypeResponseType = Record<string, ShiftType>;
