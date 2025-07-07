export type OvertimeResponseType = {
    id: number;
    employee_uuid: string;
    start_time: string;
    end_time: string;
    hours: number;
    reason: null;
    created_at: string;
    created_by: string;
    updated_at: null;
    updated_by: null;
    hours_at_lunch: number;
    hours_at_dinner: number;
    employee: {
        card_number: string;
        fullname: string;
        gender: boolean;
        work_place_id: number;
        unit_id: number;
    };
};
