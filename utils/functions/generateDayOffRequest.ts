import dayjs from 'dayjs';
import { getDateRange } from './getDateRange';

type ShiftKey = 'A' | 'B' | 'C' | 'D';

interface InputType {
    range_date: string[];
    type: number;
    hours_A: number;
    hours_B: number;
    hours_C: number;
    hours_D: number;
}

interface DayoffRequestType {
    uuid: string;
    type_id: number;
    start: string;
    end: string;
    hours: number;
    memo: string;
    stay_id: null;
    form_type: string;
    usage_year: number;
}

export function generateDayOffRequests(input: InputType, uuid: string): DayoffRequestType[] {
    const dateList = getDateRange(input.range_date);

    const shiftMap: Record<ShiftKey, { hours: number; time: [string, string]; type_id: number }> = {
        A: { hours: input.hours_A, time: ['08:00:00', '17:00:00'], type_id: 1 },
        B: { hours: input.hours_B, time: ['08:00:00', '17:00:00'], type_id: 2 },
        C: { hours: input.hours_C, time: ['08:00:00', '17:00:00'], type_id: 3 },
        D: { hours: input.hours_D, time: ['08:00:00', '17:00:00'], type_id: input.type },
    };

    const result: DayoffRequestType[] = [];

    for (const date of dateList) {
        // Sử dụng dayjs để lấy year một cách nhất quán
        const year = dayjs(date).year();

        for (const shift of ['A', 'B', 'C', 'D'] as ShiftKey[]) {
            const { hours, time, type_id } = shiftMap[shift];
            if (hours > 0) {
                const [startTime, endTime] = time;

                const start = `${date} ${startTime}`;
                const end = `${date} ${endTime}`;

                result.push({
                    uuid,
                    type_id: type_id,
                    start,
                    end,
                    hours,
                    memo: '',
                    stay_id: null,
                    form_type: 'VN',
                    usage_year: year,
                });
            }
        }
    }

    return result;
}
