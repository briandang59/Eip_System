import { AttendanceV2Type } from '@/types/response/attendance';

export const calculateTotals = (data: AttendanceV2Type[]) => {
    return data.reduce(
        (totals, record) => {
            const workday = record?.details[0]?.workday;
            if (workday) {
                totals.GC += workday.GC || 0;
                totals.NLE += workday.nle || 0;
                totals.c150 += workday.overtime?.c150 || 0;
                totals.c200 += workday.overtime?.c200 || 0;
                totals.c300 += workday.overtime?.c300 || 0;
                totals.A += workday.leave_hours?.A || 0;
                totals.B += workday.leave_hours?.B || 0;
                totals.KP += workday.KP || 0;
                totals.DT += workday.DT || 0;
                totals.G200 += workday.G200 || 0;
                totals.G210 += workday.G210 || 0;
                totals.Tcom += workday.Tcom || 0;
            }
            return totals;
        },
        {
            GC: 0,
            NLE: 0,
            c150: 0,
            c200: 0,
            c300: 0,
            A: 0,
            B: 0,
            KP: 0,
            DT: 0,
            G200: 0,
            G210: 0,
            Tcom: 0,
        },
    );
};
