import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';

export function calculateTotalsFactoryInspection(data: FactoryInspectionAttendance[]) {
    const totals = {
        GC: 0,
        nle: 0,
        GDem: 0,
        G200: 0,
        G210: 0,
        KP: 0,
        DT: 0,
        VS: 0,
        Tcom: 0,
        // Overtime
        c150: 0,
        c200: 0,
        c300: 0,
        c390: 0,
        c400: 0,
        // Leave hours
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        DB: 0,
        CV: 0,
    };

    data.forEach((employee) => {
        employee.details.forEach((detail) => {
            const w = detail.workday;
            if (!w) return;

            // --- Workday fields ---
            totals.GC += w.GC || 0;
            totals.nle += w.nle || 0;
            totals.GDem += w.GDem || 0;
            totals.G200 += w.G200 || 0;
            totals.G210 += w.G210 || 0;
            totals.KP += w.KP || 0;
            totals.DT += w.DT || 0;
            totals.VS += w.VS || 0;
            totals.Tcom += w.Tcom || 0;

            // --- Overtime ---
            if (w.overtime) {
                totals.c150 += w.overtime.c150 || 0;
                totals.c200 += w.overtime.c200 || 0;
                totals.c300 += w.overtime.c300 || 0;
                totals.c390 += w.overtime.c390 || 0;
                totals.c400 += w.overtime.c400 || 0;
            }

            // --- Leave hours ---
            if (w.leave_hours) {
                totals.A += w.leave_hours.A || 0;
                totals.B += w.leave_hours.B || 0;
                totals.C += w.leave_hours.C || 0;
                totals.D += w.leave_hours.D || 0;
                totals.DB += w.leave_hours.DB || 0;
                totals.CV += w.leave_hours.CV || 0;
            }
        });
    });

    return totals;
}
