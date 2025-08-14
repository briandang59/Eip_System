import dayjs from 'dayjs';

export const getWeekday = (dateStr: string): string => {
    return dayjs(dateStr).format('dddd');
};
