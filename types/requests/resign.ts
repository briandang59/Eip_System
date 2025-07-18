export type ResignRequestType = {
    resign_type_id: number;
    card_number: string;
    effect_date: string;
    resign_reason_id?: number;
    memo?: string;
};
