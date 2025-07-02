export type JobTitleResponseType = {
    id: number;
    created_at: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    employee_class: number;
    assign_by_user: boolean;
    code: string;
    order: number;
    active: boolean;
    location: string;
    belongs_to_workplace: number[];
};
