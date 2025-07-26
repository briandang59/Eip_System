'use client';

import React, { useEffect, useState } from 'react';
import { useDailyStatisticalAttendance } from '@/apis/useSwr/dailyStatisticalAttendance';
import AttendanceAreaChart from '@/components/charts/AttendanceAreaChart';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { Button, Select, Spin, Tabs } from 'antd';
import { getInfomation } from '@/utils/functions/getInfomation';
import { DatePicker } from 'antd';
import { FileExcelOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { House, ListRestart, UserCheck, UsersRound, UserX, Wallpaper } from 'lucide-react';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useDayoff } from '@/apis/useSwr/dayoff';
import { ExportHrStatistical } from '@/utils/excels/exportHrStatistical';
import { useDailyStatisticalAttendanceRangeDate } from '@/apis/useSwr/dailyStatisticalAttendanceRangeDate';
import { getDateRangeArray } from '@/utils/functions/getDateRangeArray';

const { RangePicker } = DatePicker;

export default function Home() {
    const { t, lang } = useTranslationCustom();
    const { workPlaces, isLoading: isLoadingWorkplace } = useWorkPlaces();
    const myInfo = getInfomation();
    const [selectedWorkplace, setSelectedWorkplace] = useState<number>(0);
    const [rangeDate, setRangeDate] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs().subtract(1, 'day'),
        end: dayjs(),
    });

    useEffect(() => {
        if (myInfo) {
            setSelectedWorkplace(myInfo.work_place_id);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        statisticalOneDayAttendance,
        isLoading: isLoadingSatisticalOneDay,
        mutate,
    } = useDailyStatisticalAttendance({
        date: dayjs(rangeDate.start).format('YYYY-MM-DD'),
        place_id: selectedWorkplace,
    });
    const { statisticalRangeDayAttendance } = useDailyStatisticalAttendanceRangeDate({
        start: dayjs(rangeDate.start).format('YYYY-MM-DD'),
        end: dayjs(rangeDate.end).format('YYYY-MM-DD'),
        place_id: selectedWorkplace,
    });
    const { dayoff, isLoading: isLoadingDayoff } = useDayoff({
        work_place_id: selectedWorkplace,
        start: dayjs(rangeDate.start).format('YYYY-MM-DD'),
        end: dayjs(rangeDate.end).format('YYYY-MM-DD'),
    });
    if (isLoadingSatisticalOneDay) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Spin />
            </div>
        );
    }

    const handleRangeDateChange: RangePickerProps['onChange'] = (dates) => {
        if (dates && dates[0] && dates[1]) {
            setRangeDate({
                start: dates[0],
                end: dates[1],
            });
        } else {
            setRangeDate({
                start: dayjs(),
                end: dayjs(),
            });
        }
    };

    const handleReload = () => {
        mutate();
    };

    const handleExport = () => {
        if (statisticalRangeDayAttendance.length > 0) {
            console.log(statisticalRangeDayAttendance);
            const rangeDateArray = getDateRangeArray(
                dayjs(rangeDate.start).format('YYYY-MM-DD'),
                dayjs(rangeDate.end).format('YYYY-MM-DD'),
            );
            ExportHrStatistical(
                selectedWorkplace,
                statisticalRangeDayAttendance,
                workPlaces || [],
                rangeDateArray,
            );
        }
    };
    const tabs = [
        {
            key: '1',
            label: t.statistical_attendance.checkout_early,
            children: <></>,
            icon: <House />,
        },
        {
            key: '2',
            label: t.statistical_attendance.checkin_late,
            children: <></>,
            icon: <ListRestart />,
        },
        {
            key: '3',
            label: t.statistical_attendance.take_leave,
            children: (
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                    {!isLoadingDayoff ? (
                        dayoff?.map((item) => (
                            <div
                                className="grid grid-cols-3 gap-2 p-2 bg-green-100 border border-green-700 rounded-[10px]"
                                key={item.id}
                            >
                                <p className="font-medium">{item.applicant.fullname}</p>
                                <p>{item.leave_type.name_vn}</p>
                                <p>{dayjs(item.start).format('YYYY-MM-DD')}</p>
                            </div>
                        ))
                    ) : (
                        <Spin />
                    )}
                </div>
            ),
            icon: <Wallpaper />,
        },
    ];
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Select
                    options={workPlaces?.map((item) => ({
                        value: item.id,
                        label: item.name_en,
                    }))}
                    className="w-[150px]"
                    loading={isLoadingWorkplace}
                    onChange={setSelectedWorkplace}
                    value={selectedWorkplace}
                />
                <RangePicker
                    value={[rangeDate.start, rangeDate.end]}
                    onChange={handleRangeDateChange}
                    format="YYYY-MM-DD"
                />
                <Button icon={<FileExcelOutlined />} onClick={handleExport}>
                    {t.statistical_attendance.export}
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReload}>
                    {t.statistical_attendance.reload}
                </Button>
            </div>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8">
                    {statisticalOneDayAttendance && (
                        <AttendanceAreaChart data={statisticalOneDayAttendance} />
                    )}
                </div>
                <div className="col-span-4 rounded-[10px] border border-gray-200 p-4 flex flex-col gap-4">
                    <p className="text-[16px] font-bold">{t.statistical_attendance.unit}</p>
                    <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
                        {statisticalOneDayAttendance.map((item) => (
                            <div
                                key={item?.unit?.id}
                                className="flex-shrink-0 flex flex-col gap-4 min-h-[50px] w-[150px] border border-gray-200 rounded-[10px] p-2"
                            >
                                <p className="font-medium text-green-700 text-[16px]">
                                    {getLocalizedName(
                                        item?.unit?.name_en,
                                        item?.unit?.name_zh,
                                        item?.unit?.name_vn,
                                        lang,
                                    )}
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <UsersRound
                                            strokeWidth={1.5}
                                            className="size-[16px] text-blue-700"
                                        />
                                        <span>{item?.unit_employee_num}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserCheck
                                            strokeWidth={1.5}
                                            className="size-[16px] text-green-700"
                                        />
                                        <span>{item?.dayoff_employee_num}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserX
                                            strokeWidth={1.5}
                                            className="size-[16px] text-red-700"
                                        />
                                        <span>{item?.absence_without_leave_num}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Tabs defaultActiveKey="1" items={tabs} />
                </div>
            </div>
        </div>
    );
}
