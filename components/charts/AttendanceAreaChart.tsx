'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AttendanceAreaChartProps {
    data: DailyStatisticalAttendance[];
}

export type DailyStatisticalAttendance = {
    unit: {
        id: number;
        code: string;
        manager: string | null;
        name_en: string;
        name_vn: string;
        name_zh: string;
        type_id: number;
        class_id: number;
        created_at: string;
        created_by: null;
        group_code: string | null;
        updated_at: string | null;
        updated_by: string | null;
        category_id: number;
        parent_unit_id: number | null;
        staffing_limit: null;
        belongs_to_workplace: number[];
        support_employee_class: number[];
        organization_unit_category: {
            id: number;
            name_en: string | null;
            name_vn: string | null;
            name_zh: string | null;
        };
    };
    unit_employee_num: number;
    day_shift_num: number;
    after_noon_shift_number: number;
    night_shift_num: number;
    dayoff_employee_num: number;
    attendance_employee_num: number;
    absence_without_leave_num: number;
    day_shift: ShiftStatisticalAttendance;
    afternoon_shift: ShiftStatisticalAttendance;
    night_shift: ShiftStatisticalAttendance;
};

type ShiftStatisticalAttendance = {
    total_employee: number;
    actual_attendance: number;
    total_take_leave: number;
    absence_without_leave_num: number;
    percentage: string;
};

const AttendanceAreaChart: React.FC<AttendanceAreaChartProps> = ({ data }) => {
    const { lang, t } = useTranslationCustom();
    const categories = data.map((item) =>
        getLocalizedName(item.unit.name_en, item.unit.name_zh, item.unit.name_vn, lang),
    );
    const dayShiftData = data.map((item) => item.day_shift.actual_attendance);
    const afternoonShiftData = data.map((item) => item.afternoon_shift.actual_attendance);
    const nightShiftData = data.map((item) => item.night_shift.actual_attendance);

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 700,
            zoom: {
                enabled: true,
            },
            toolbar: {
                show: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 4,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 0.5,
                opacityFrom: 0.7,
                opacityTo: 0.3,
            },
        },
        xaxis: {
            categories,
            title: {
                text: t.chart.units,
            },
        },
        yaxis: {
            title: {
                text: t.chart.number_of_employee,
            },
        },
        tooltip: {
            enabled: true,
        },
        colors: ['#00E396', '#FF4560', '#775DD0'],
        legend: {
            position: 'top',
        },
    };

    const series = [
        {
            name: t.chart.day_shift,
            data: dayShiftData,
        },
        {
            name: t.chart.afternoon_shift,
            data: afternoonShiftData,
        },
        {
            name: t.chart.night_shift,
            data: nightShiftData,
        },
    ];

    return (
        <div className="">
            <ApexChart options={options} series={series} type="area" height={700} />
        </div>
    );
};

export default AttendanceAreaChart;
