import dayjs from 'dayjs';
import { getDateRange } from './getDateRange';

type ShiftKey = 'A' | 'B' | 'C' | 'DB' | 'CV';

interface InputType {
    range_date: string[];
    type?: number;
    hours_A: number;
    hours_B: number;
    hours_C: number;
    hours_DB: number;
    hours_CV: number;
}

interface DayoffRequestType {
    uuid: string;
    type_id?: number;
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
        A: { hours: input.hours_A, time: ['08:00:00', '17:30:00'], type_id: 1 },
        B: { hours: input.hours_B, time: ['08:00:00', '17:30:00'], type_id: 2 },
        C: { hours: input.hours_C, time: ['08:00:00', '17:30:00'], type_id: 3 },
        DB: { hours: input.hours_DB, time: ['08:00:00', '17:30:00'], type_id: 4 },
        CV: { hours: input.hours_CV, time: ['08:00:00', '17:30:00'], type_id: 8 },
    };

    const result: DayoffRequestType[] = [];

    for (const date of dateList) {
        // Sử dụng dayjs để lấy year một cách nhất quán
        const year = dayjs(date).year();

        for (const shift of ['A', 'B', 'C', 'DB', 'CV'] as ShiftKey[]) {
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
