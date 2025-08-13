import { TableColumnsType } from 'antd';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';
import { Baby, Calendar, Users } from 'lucide-react';
import { getDayOfWeek } from '@/utils/functions/getDayOfWeek';
import { formatNumber } from '@/utils/functions/formatNumber';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import dayjs from 'dayjs';
import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';
import { formatTimeHHmm } from '@/utils/functions/formatTimeHHmm';
import { checkInPregnancyOrTakeCareChild } from '@/utils/functions/checkInPregnancyOrTakeCareChild';

const UnitCell = ({ unit }: { unit: FactoryInspectionAttendance['unit'] }) => {
    const unitName = useChangeLanguage(unit.name_en, unit.name_zh, unit.name_vn);
    return <div>{unitName}</div>;
};

export const useFactoryInspectionAttendanceCols =
    (): TableColumnsType<FactoryInspectionAttendance> => {
        const { t } = useTranslationCustom();
        return [
            {
                title: 'Stt',
                width: 100,
                dataIndex: 'stt',
                key: 'stt',
                fixed: 'left',
                render: (_, _record, index) => {
                    return <div className="text-nowrap">{index + 1}</div>;
                },
            },
            {
                title: t.workday.card_number,
                width: 120,
                dataIndex: 'card_number',
                key: 'card_number',
                fixed: 'left',
                sorter: (a, b) => {
                    return a?.card_number?.localeCompare(b?.card_number);
                },
            },
            {
                title: t.workday.fullname,
                dataIndex: 'fullname',
                key: 'fullname',
                width: 150,
                fixed: 'left',
                sorter: (a, b) => {
                    return a?.fullname?.localeCompare(b?.fullname);
                },
                render: (_, record) => {
                    return <div className="text-nowrap">{record?.fullname}</div>;
                },
            },
            {
                title: t.workday.unit,
                dataIndex: 'unit',
                key: 'unit',
                width: 100,
                fixed: 'left',
                // sorter: (a, b) => {
                //     return a?.unit?.name_en?.localeCompare(b?.unit?.name_en);
                // },
                render: (_, record) => {
                    return <UnitCell unit={record.unit} />;
                },
            },
            {
                title: t.workday.shift,
                dataIndex: 'shift',
                key: 'shift',
                width: 180,
                fixed: 'left',
                sorter: (a: FactoryInspectionAttendance, b: FactoryInspectionAttendance) => {
                    const tagA = a.details?.[0]?.shift?.tag ?? '';
                    const tagB = b.details?.[0]?.shift?.tag ?? '';

                    return tagA.localeCompare(tagB); // luôn number
                },

                render: (_, record) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Calendar
                                strokeWidth={1.5}
                                className="w-4 h-4 text-purple-500 font-bold"
                            />
                            <span className="text-blue-500 font-medium text-sm">
                                {record?.details[0]?.shift?.tag ?? ''}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {record?.details[0]?.shift?.start_time &&
                                    record?.details[0]?.shift?.end_time &&
                                    ` ( ${record?.details[0]?.shift?.start_time} - ${record?.details[0]?.shift?.end_time} )`}
                            </span>
                        </div>
                    );
                },
            },
            {
                title: t.workday.date,
                dataIndex: 'date',
                key: 'date',
                width: 100,
                sorter: (a, b) => {
                    return a?.details[0]?.date?.localeCompare(b?.details[0]?.date);
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-blue-500 font-medium">
                            {record?.details[0]?.date}
                        </div>
                    );
                },
            },
            {
                title: t.workday.week,
                dataIndex: 'week',
                key: 'week',
                width: 100,
                sorter: (a, b) => {
                    return a?.details[0]?.date?.localeCompare(b?.details[0]?.date);
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap">{getDayOfWeek(record?.details[0]?.date)}</div>
                    );
                },
            },
            {
                title: 'T1',
                dataIndex: 't1',
                key: 't1',
                width: 70,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.T1?.time?.localeCompare(
                        b?.details[0]?.workday?.T1?.time,
                    );
                },
                render: (_: unknown, record: FactoryInspectionAttendance) => {
                    const time = formatTimeHHmm(record?.details[0]?.workday?.T1?.time);
                    return <p className="font-medium text-purple-600 text-center">{time || '-'}</p>;
                },
            },
            {
                title: 'T2',
                dataIndex: 't2',
                key: 't2',
                width: 70,
                sorter: (a, b) => {
                    const t1 = a?.details?.[0]?.workday?.T2?.time
                        ? dayjs(a.details[0].workday.T2.time, 'YYYY-MM-DD HH:mm:ss').valueOf()
                        : 0;

                    const t2 = b?.details?.[0]?.workday?.T2?.time
                        ? dayjs(b.details[0].workday.T2.time, 'YYYY-MM-DD HH:mm:ss').valueOf()
                        : 0;

                    return t1 - t2;
                },
                render: (_: unknown, record: FactoryInspectionAttendance) => {
                    const time = formatTimeHHmm(record?.details[0]?.workday?.T2?.time);
                    return <p className="font-medium text-purple-600 text-center">{time || '-'}</p>;
                },
            },

            {
                title: 'GC',
                dataIndex: 'GC',
                key: 'GC',
                width: 50,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.GC - b?.details[0]?.workday?.GC;
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.GC > 0
                                ? record?.details[0]?.workday?.GC
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'NLE',
                dataIndex: 'NLE',
                key: 'NLE',
                width: 50,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.nle - b?.details[0]?.workday?.nle;
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.nle > 0
                                ? record?.details[0]?.workday?.nle
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: '150',
                dataIndex: '150',
                key: '150',
                width: 50,
                sorter: (a, b) => {
                    return (
                        a?.details[0]?.workday?.overtime?.c150 -
                        b?.details[0]?.workday?.overtime?.c150
                    );
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.overtime?.c150 > 0
                                ? record?.details[0]?.workday?.overtime?.c150
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: '200',
                dataIndex: '200',
                key: '200',
                width: 50,
                sorter: (a, b) => {
                    return (
                        a?.details[0]?.workday?.overtime?.c200 -
                        b?.details[0]?.workday?.overtime?.c200
                    );
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.overtime?.c200 > 0
                                ? record?.details[0]?.workday?.overtime?.c200
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: '300',
                dataIndex: '300',
                key: '300',
                width: 50,
                sorter: (a, b) => {
                    return (
                        a?.details[0]?.workday?.overtime?.c300 -
                        b?.details[0]?.workday?.overtime?.c300
                    );
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.overtime?.c300 > 0
                                ? record?.details[0]?.workday?.overtime?.c300
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'A',
                dataIndex: 'A',
                key: 'A',
                width: 50,
                sorter: (a, b) => {
                    return (
                        a?.details[0]?.workday?.leave_hours.A -
                        b?.details[0]?.workday?.leave_hours.A
                    );
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.leave_hours.A > 0
                                ? record?.details[0]?.workday?.leave_hours.A
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'KP',
                dataIndex: 'KP',
                key: 'KP',
                width: 50,
                render: (_: unknown, record: FactoryInspectionAttendance, _index: number) => {
                    return (
                        <p>
                            {record?.details[0]?.workday?.KP === 0
                                ? '-'
                                : record?.details[0]?.workday?.KP}
                        </p>
                    );
                },
            },
            {
                title: 'B',
                dataIndex: 'B',
                key: 'B',
                width: 50,
                sorter: (a, b) => {
                    return (
                        a?.details[0]?.workday?.leave_hours.B -
                        b?.details[0]?.workday?.leave_hours.B
                    );
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.leave_hours.B > 0
                                ? record?.details[0]?.workday?.leave_hours.B
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'C',
                dataIndex: 'C',
                key: 'C',
                width: 50,
                sorter: (a, b) => {
                    return (
                        a?.details[0]?.workday?.leave_hours.C -
                        b?.details[0]?.workday?.leave_hours.C
                    );
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.leave_hours.C > 0
                                ? record?.details[0]?.workday?.leave_hours.C
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'DT',
                dataIndex: 'DT',
                key: 'DT',
                width: 50,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.DT - b?.details[0]?.workday?.DT;
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.DT > 0
                                ? record?.details[0]?.workday?.DT
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'VS',
                dataIndex: 'VS',
                key: 'VS',
                width: 50,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.VS - b?.details[0]?.workday?.VS;
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.VS > 0
                                ? record?.details[0]?.workday?.VS
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'GDem',
                dataIndex: 'GDem',
                key: 'GDem',
                width: 70,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.GDem - b?.details[0]?.workday?.GDem;
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.GDem > 0
                                ? record?.details[0]?.workday?.GDem
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'G200',
                dataIndex: 'G200',
                key: 'G200',
                width: 60,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.G200 - b?.details[0]?.workday?.G200;
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center text-green-500 font-medium">
                            {record?.details[0]?.workday?.G200 > 0
                                ? record?.details[0]?.workday?.G200
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'G210',
                dataIndex: 'G210',
                key: 'G210',
                width: 60,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.G210 - b?.details[0]?.workday?.G210;
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center text-blue-500 font-medium">
                            {record?.details[0]?.workday?.G210 > 0
                                ? record?.details[0]?.workday?.G210
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'Tcom',
                dataIndex: 'Tcom',
                key: 'Tcom',
                width: 70,
                sorter: (a, b) => {
                    return a?.details[0]?.workday?.Tcom - b?.details[0]?.workday?.Tcom;
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center font-medium">
                            {record?.details[0]?.workday?.Tcom > 0
                                ? formatNumber(record?.details[0]?.workday?.Tcom)
                                : '-'}
                        </div>
                    );
                },
            },
            {
                title: 'CTMTCN',
                dataIndex: 'CTMTCN',
                key: 'CTMTCN',
                width: 80,
                render: (_: any, record: FactoryInspectionAttendance, index: number) => {
                    if (!record?.pregnancy?.start_date) return;
                    const isPregnant = checkInPregnancyOrTakeCareChild(
                        record?.pregnancy?.start_date,
                        record?.pregnancy?.end_date,
                        record?.details[0]?.date,
                    );
                    const isTakeCareChild = checkInPregnancyOrTakeCareChild(
                        record?.has_children?.start_date,
                        record?.has_children?.end_date,
                        record?.details[0]?.date,
                    );

                    if (isPregnant) {
                        return (
                            <div className="flex items-center justify-center gap-2">
                                <Users className="w-4 h-4 text-red-500" />
                                <p className="text-red-500">MT</p>
                            </div>
                        );
                    }
                    if (isTakeCareChild) {
                        return (
                            <div className="flex items-center justify-center gap-2">
                                <Baby className="w-4 h-4 text-blue-500" />
                                <p className="text-blue-500">CN</p>
                            </div>
                        );
                    }

                    return <p className="text-center">-</p>;
                },
            },
            {
                title: 'VPSX',
                dataIndex: 'VPSX',
                key: 'VPSX',
                width: 60,
                sorter: (a, b) => {
                    return a?.details[0]?.employee_class_code?.localeCompare(
                        b?.details[0]?.employee_class_code,
                    );
                },
                render: (_, record) => {
                    return (
                        <div className="text-nowrap text-center">
                            {record?.details[0]?.employee_class_code}
                        </div>
                    );
                },
            },
            {
                title: 'PNTrua',
                dataIndex: 'PNTrua',
                key: 'PNTrua',
                width: 60,
                render: (_, _record) => {
                    return <div className="text-nowrap text-center">-</div>;
                },
            },
            {
                title: 'PNTca',
                dataIndex: 'PNTca',
                key: 'PNTca',
                width: 60,
                render: (_, _record) => {
                    return <div className="text-nowrap text-center">-</div>;
                },
            },
            {
                title: '',
                key: 'operation',
                fixed: 'right',
                width: 50,
            },
        ];
    };
