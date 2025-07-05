export type AttendanceUpdateRequestType = {
    id: number;
    modify_reason_id?: number;
    modify_reason_text?: string;
    shift_id?: number;
    clockin_time?: string;
    clockout_time?: string;
    erase_clockin?: boolean;
    erase_clockout?: boolean;
    date?: string;
};

export type AttendanceCreateRequestType = {
    card_number: string;
    reason_id: number;
    reason_text: string | null;
    clockin_time: string;
    clockout_time: string;
    date: string;
};
