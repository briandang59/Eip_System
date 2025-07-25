export type CreateShiftRequestType = {
    id?: number;
    class_name: string;
    clockin_time: string;
    clockout_time: string;
    break_start: string;
    break_end: string;
    location: string;
    active?: boolean;
    period_id: number;
    allow_auto_overtime: boolean;
};
