// utils/functions/mergeShiftDate.ts
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

import type { ShiftDateResponseType } from '@/types/response/shiftType';
import type { EmployeeResponseType } from '@/types/response/employees';
import { DayKey } from '@/types/response/dateKey';

export type EmployeeRow = EmployeeResponseType & { [K in DayKey]: string | undefined };

interface Params {
    employees: EmployeeResponseType[];
    shifts?: ShiftDateResponseType[];
    year: number;
    month: number;
}

export function mergeShiftDates({ employees, shifts, year, month }: Params): EmployeeRow[] {
    const days = dayjs(`${year}-${month}-01`).daysInMonth();
    const startOfMonth = dayjs(`${year}-${month}-01`);
    const endOfMonth = startOfMonth.endOf('month');

    const map: Record<string, EmployeeRow> = {};
    const blank = {} as Record<DayKey, string>;
    for (let d = 1; d <= days; d++) {
        blank[d.toString().padStart(2, '0') as DayKey] = '';
    }

    employees.forEach((emp) => {
        map[emp.card_number] = { ...emp, ...blank };
    });

    shifts?.forEach((sd) => {
        const row = map[sd.card_number];
        if (!row) return;

        const start = dayjs(sd.start_date).isBefore(startOfMonth)
            ? startOfMonth
            : dayjs(sd.start_date);
        const end = dayjs(sd.end_date).isAfter(endOfMonth) ? endOfMonth : dayjs(sd.end_date);

        for (let d = start.date(); d <= end.date(); d++) {
            if (start.year() === year && start.month() + 1 === month) {
                const k = d.toString().padStart(2, '0') as DayKey;
                row[k] = sd.class_id.tag;
            }
        }
    });

    return Object.values(map).sort((a, b) => {
        const aDate = a['01'] ?? '';
        const bDate = b['01'] ?? '';
        return aDate.localeCompare(bDate, undefined, { sensitivity: 'base' });
    });
}
