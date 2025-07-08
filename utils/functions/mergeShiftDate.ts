// utils/functions/mergeShiftDates.ts
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

import type { ShiftDateResponseType } from '@/types/response/shiftType';
import type { EmployeeResponseType } from '@/types/response/employees';
import { DayKey } from '@/types/response/dateKey';

/** Dòng hiển thị trong bảng: Employee + cột ngày động */
export type EmployeeRow = EmployeeResponseType & { [K in DayKey]: string };

interface Params {
    employees: EmployeeResponseType[]; // danh sách nhân viên luôn có
    shifts?: ShiftDateResponseType[]; // shift‑date (có thể trống)
    year: number;
    month: number; // 1‑12
}

/* Gộp: luôn sinh 1 record / nhân viên */
export function mergeShiftDates({ employees, shifts, year, month }: Params): EmployeeRow[] {
    const days = dayjs(`${year}-${month}-01`).daysInMonth();

    const map: Record<string, EmployeeRow> = {};

    employees.forEach((emp) => {
        const blank = {} as Record<DayKey, string>;
        for (let d = 1 as const; d <= days; d++) {
            const k = d.toString().padStart(2, '0') as DayKey;
            blank[k] = '';
        }
        map[emp.card_number] = { ...emp, ...blank };
    });

    shifts?.forEach((sd) => {
        const row = map[sd.card_number];
        if (!row) return;

        let cur = dayjs(sd.start_date);
        const end = dayjs(sd.end_date);

        while (cur.isSameOrBefore(end, 'day')) {
            if (cur.year() === year && cur.month() + 1 === month) {
                const k = cur.date().toString().padStart(2, '0') as DayKey;
                row[k] = sd.class_id.tag;
            }
            cur = cur.add(1, 'day');
        }
    });

    return Object.values(map);
}
