export type LogEntry = {
    personCode: string;
    happenDate: string;
    happenTime: string;
    picUri: string;
};

export type DateLogMap = {
    [date: string]: LogEntry[];
};
