export type FormRequestResponseType = {
    id: string;
    card_number: string;
    form_type_id: number;
    unit_id: number;
    status: number;
    created_at: string;
    work_place: number;
    custom_fields: {
        to: string;
        since: string;
        location: string;
        total_days: number;
        leave_reason: string;
    };
    status_name: string;
    applicant: {
        employee_uuid: string;
        card_number: string;
        fullname: string;
        unit_id: number;
        unit_name: string;
        job_title_id: number;
        job_title_name: string;
        work_place_id: number;
        work_place_name: string;
    };
    attachments: [];
};

export type FormApprovalResponse = {
    id: string;
    approver_employee_id: string;
    request_id: string;
    status: number;
    approve_at: string;
    comment: string;
    approver_role_id: number;
    step_order: number;
    work_place: number;
    status_name: string;
    approver_name: string;
    request: {
        id: string;
        card_number: string;
        form_type_id: number;
        unit_id: number;
        status: number;
        created_at: string;
        work_place: number;
        custom_fields: any;
        status_name: string;
        applicant: {
            employee_uuid: string;
            card_number: string;
            fullname: string;
            unit_id: number;
            unit_name: string;
            job_title_id: number;
            job_title_name: string;
            work_place_id: number;
            work_place_name: string;
        };
    };
};
