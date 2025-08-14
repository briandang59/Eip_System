import { AttendanceV2Type } from '@/types/response/attendance';
import { getWeekday } from '../functions/getWeekday';
import dayjs from 'dayjs';

interface IDataReport {
    attendance: AttendanceV2Type[];
}

export type DataReportType = {
    fullname: string;
    card_number: string;
    unit: string;
    unit_name: string;
    employee_class: string;
    details: {
        '15': number;
        '20': number;
        '30': number;
        '39': number;
        date: string;
        days: string;
        T1: string;
        T2: string;
        T3: number;
        T4: number;
        nle: number;
        GC: number;
        'T.com': number;
        VR: number;
        PB: number;
        KP: number;
        PN: number;
        ĐP: number;
        Chờv: number;
        Gđ: number;
        TcCĐ: number;
        Đtr: number;
        Vs: number;
        'Mt-Cnho': string;
        note: string;
    }[];
};

export const useDataReport = ({ attendance }: IDataReport): DataReportType[] => {
    const grouped = attendance.reduce((acc, item) => {
        const key = item.card_number || '';

        const details = item.details.map((detail) => ({
            date: dayjs(detail.date).format('MM-DD') || '',
            days: getWeekday(detail.date) || '',
            T1: detail.workday?.T1?.time ? dayjs(detail.workday.T1.time).format('HH:mm') : '',
            T2: detail.workday?.T2?.time ? dayjs(detail.workday.T2.time).format('HH:mm') : '',
            T3: 0,
            T4: 0,
            nle: detail.workday?.nle || 0,
            '30': detail.workday?.overtime?.c300 || 0,
            '39': detail.workday?.overtime?.c390 || 0,
            GC: detail.workday?.GC || 0,
            '15': detail.workday?.overtime?.c150 || 0,
            '20': detail.workday?.overtime?.c200 || 0,
            'T.com': detail.workday?.Tcom || 0,
            VR: detail.workday?.leave_hours.A || 0,
            PB: detail.workday?.leave_hours?.C || 0,
            KP: detail.workday?.KP || 0,
            PN: detail.workday?.leave_hours?.B || 0,
            ĐP:
                detail.workday?.leave_hours?.E +
                    detail.workday?.leave_hours?.D +
                    detail.workday?.leave_hours?.F +
                    detail.workday?.leave_hours?.G +
                    detail.workday?.leave_hours?.H +
                    detail.workday?.leave_hours?.I || 0,
            Chờv: 0,
            Gđ: detail.shift?.is_night_shift ? detail.workday?.GC : 0,
            TcCĐ: detail.shift?.is_night_shift ? detail.workday?.G200 || detail.workday?.G210 : 0,
            Đtr: detail.workday?.DT || 0,
            Vs: detail.workday?.VS || 0,
            'Mt-Cnho': item.pregnancy?.start_date || item.has_children?.start_date || '',
            note: '',
        }));

        // Tìm xem người này đã có trong mảng chưa
        const existing = acc.find((x) => x.card_number === key);

        if (existing) {
            existing.details.push(...details);
        } else {
            acc.push({
                fullname: item.fullname || '',
                card_number: key,
                unit: item.unit?.code || '',
                unit_name: item.unit?.name_vn || '',
                employee_class: '',
                details: details,
            });
        }

        return acc;
    }, [] as DataReportType[]);

    return grouped;
};
