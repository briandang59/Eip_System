export type TransferEmployeesResponseType = {
    card_number: string;
    fullname: string;
    gender: boolean;
    join_company_date: string;
    origin: {
        card_number: string;
        service_unit: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
        };
        job_title: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
        };
        event_date: string;
        work_place: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
        };
        job_class: null;
    };
    transfer: {
        card_number: string;
        service_unit: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
        };
        job_title: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
        };
        event_date: string;
        work_place: {
            id: number;
            name_en: string;
            name_zh: string;
            name_vn: string;
        };
        job_class: {
            id: number;
            created_at: string;
            name_en: string;
            name_zh: string;
            name_vn: string;
            assign_by_user: boolean;
            code: string;
        };
    };
};
