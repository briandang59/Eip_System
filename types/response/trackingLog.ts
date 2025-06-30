export type TrackingLogResponse = {
    id: number;
    created_at: string;
    account: string;
    user: string;
    description: string;
    parameters: any;
    status_code: number;
    message: string;
    response_data: any;
    url: string;
    method: string;
};
