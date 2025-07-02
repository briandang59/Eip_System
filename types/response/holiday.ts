export type HolidayResponseType = {
    id: number;
    date: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    description: string | null;
    salary_increase: string | null;
    created_at: string;
    nation_id: number | null;
};
