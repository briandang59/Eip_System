export type LogEntry = {
    personCode: string;
    happenDate: string;
    happenTime: string;
    picUri: string;
    work_place_id: number;
};

export type DateLogMap = {
    [date: string]: LogEntry[];
};
