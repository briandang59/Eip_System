export type RecordFormResponse = {
    _id: string;
    applicant: {
        employee_uuid: string;
        fullname: string;
        job_title_id: number;
        job_title_name: string;
        unit_id: number;
        unit_name: string;
        work_place_id: number;
        work_place_name: string;
    };
    type_id: number;
    type_name: string;
    content: any;
    approvers: {} | null;
    status: {
        code: string;
        id: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    case_closure_at: null;
    location: string;
};
