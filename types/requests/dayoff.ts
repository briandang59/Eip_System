export type DayoffRequestType = {
    id?: number;
    uuid: string;
    type_id?: number | null;
    start: string;
    end: string;
    hours: number;
    substitute?: string;
    memo?: string;
    stay_id: number | null;
    form_type: string;
    usage_year?: number;
};
