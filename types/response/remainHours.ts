export type RemainHoursResponseType = {
    last_year: {
        year: number;
        available: {
            hours: number;
        };
        used: {
            hours: number;
        };
        remain: {
            hours: number;
        };
    };
    this_year: {
        year: number;
        available: {
            hours: number;
            reset_date: string;
        };
        used: {
            hours: number;
        };
        remain: {
            hours: number;
        };
    };
};
