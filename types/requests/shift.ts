export type ShiftCreateRequestType = {
    card_numbers: string[];
    start: string;
    end: string;
    shift_id: number;
    note: string;
};

export type ShiftDeleteRequestType = {
    card_number: string;
    start_date: string;
    end_date: string;
};

export type ShiftModifyRequestType = ShiftDeleteRequestType & {
    shift_id: number;
};
