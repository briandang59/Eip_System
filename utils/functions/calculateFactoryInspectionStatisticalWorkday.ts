import { StatisticalWorkdayType } from '@/types/response/attendance';
import { calculateDTVS } from './calculateDTVS';
import { calculateSGC } from './calculateSGC';
import { calculateAllH } from './calculateAllH';
import { calculateMonthH } from './calculateMonthH';
import { checkSunday } from './checkSunday';
import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';
import { calculateCcan, calculateCCAN_BVE } from './calculateCCAN';
import { BVE, LT_BVE } from '../constants/vairables';

export const calculateFactoryInspectionStatisticalWorkday = (
    attendance: FactoryInspectionAttendance[],
    year: number,
    month: number,
): StatisticalWorkdayType[] => {
    const employeeGroups = attendance.reduce(
        (groups, item) => {
            const key = item.card_number;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        },
        {} as Record<string, FactoryInspectionAttendance[]>,
    );

    return Object.values(employeeGroups).map((employeeAttendance) => {
        let total_GC = 0;
        let total_NLE = 0;
        let total_150 = 0;
        let total_200 = 0;
        let total_300 = 0;
        let total_390 = 0;
        let total_400 = 0;
        let total_A = 0;
        let total_B = 0;
        let total_KP = 0;
        let total_C = 0;
        let total_DB = 0;
        let total_CV = 0;
        let total_DT = 0;
        let total_VS = 0;
        let total_G200 = 0;
        let total_G210 = 0;
        let total_Gdem = 0;
        let total_CCAN = 0;
        let total_Tcom = 0;
        let total_MonthH = 0;
        let total_HChuan = 208;
        let total_SGC = 0;
        let total_AllH = 0;

        employeeAttendance.forEach((item) => {
            if (item.details.length > 0) {
                const details = item.details[0];
                const check_sunday = checkSunday(details?.date);
                const result = calculateDTVS(
                    details?.workday.DT || 0,
                    details?.workday.VS || 0,
                    check_sunday ? 0 : details?.workday.KP || 0,
                    details?.date,
                );
                total_GC += details?.workday.GC || 0;
                total_NLE += details?.workday.nle || 0;
                total_150 += details?.workday.overtime.c150 || 0;
                total_200 += details?.workday.overtime.c200 || 0;
                total_300 += details?.workday.overtime.c300 || 0;
                total_390 += details?.workday.overtime.c390 || 0;
                total_400 += details?.workday.overtime.c400 || 0;
                total_A += details?.workday.leave_hours.A || 0;
                total_B += details?.workday.leave_hours.B || 0;
                total_KP += result.kp_time || 0;
                total_C += details?.workday.leave_hours.C || 0;
                total_DB += details?.workday.leave_hours.DB || 0;
                total_CV += details?.workday.leave_hours.A || 0;
                total_G200 += details?.workday.G200 || 0;
                total_G210 += details?.workday.G210 || 0;
                total_Gdem += details?.workday.GDem || 0;
                total_DT += result.money_DT;
                total_VS += result.money_VS;
                total_SGC += calculateSGC(
                    details?.workday.GC,
                    details?.workday.nle,
                    details?.workday.leave_hours.B,
                    details?.workday.leave_hours.D,
                );
                total_AllH += calculateAllH(
                    details?.workday.GC,
                    details?.workday.nle,
                    details?.workday.leave_hours.A,
                    details?.workday.leave_hours.B,
                    details?.workday.leave_hours.C,
                    details?.workday.leave_hours.D,
                    result.kp_time,
                );
                total_MonthH = calculateMonthH(year, month);
                total_HChuan = total_MonthH > 208 ? 208 : total_MonthH;

                total_Tcom += details?.workday.Tcom || 0;
            }
        });

        if (
            employeeAttendance[0]?.unit.code === LT_BVE ||
            employeeAttendance[0]?.unit.code === BVE
        ) {
            total_CCAN = calculateCCAN_BVE(total_KP, total_A, total_C);
        } else {
            total_CCAN = calculateCcan(total_SGC > 0 ? total_SGC : 0, total_KP, total_A, total_C);
        }

        return {
            card_number: employeeAttendance[0]?.card_number || '',
            fullname: employeeAttendance[0]?.fullname || '',
            unit: employeeAttendance[0]?.unit || {
                id: 0,
                code: '',
                name_en: '',
                name_zh: '',
                name_vn: '',
            },
            active: employeeAttendance[0]?.active || false,
            total_GC,
            total_NLE,
            total_150,
            total_200,
            total_300,
            total_390,
            total_400,
            total_A,
            total_B,
            total_KP,
            total_C,
            total_DB,
            total_CV,
            total_DT,
            total_VS,
            total_G200,
            total_G210,
            total_Gdem,
            total_CCAN,
            total_Tcom,
            total_MonthH,
            total_HChuan,
            total_AllH,
            total_SGC,
            month: `${year}-${month > 9 ? month : `0${month}`}`,
        };
    });
};
