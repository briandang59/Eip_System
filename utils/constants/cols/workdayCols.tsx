import { Button, Popover, TableColumnsType } from 'antd';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';
import {
    AlertCircle,
    Baby,
    Calendar,
    Clock,
    ClockAlert,
    Eye,
    Home,
    Paperclip,
    Settings,
    Users,
} from 'lucide-react';
import { getDayOfWeek } from '@/utils/functions/getDayOfWeek';
import { formatTimeHHmm } from '@/utils/functions/formatTimeHHmm';
import { formatNumber } from '@/utils/functions/formatNumber';
import { AttendanceV2Type } from '@/types/response/attendance';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { CheckInPregnancyOrTakeCareChild } from '@/utils/functions/CheckInPregnancyOrTakeCareChild';

const UnitCell = ({ unit }: { unit: AttendanceV2Type['unit'] }) => {
    const unitName = useChangeLanguage(unit.name_en, unit.name_zh, unit.name_vn);
    return <div>{unitName}</div>;
};

export const useWorkdayCols = (): TableColumnsType<AttendanceV2Type> => {
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
            title: 'Card number',
            width: 120,
            dataIndex: 'card_number',
            key: 'card_number',
            fixed: 'left',
            sorter: (a, b) => {
                return a?.card_number?.localeCompare(b?.card_number);
            },
        },
        {
            title: 'Full name',
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
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            width: 100,
            fixed: 'left',
            sorter: (a, b) => {
                return a?.unit?.name_en?.localeCompare(b?.unit?.name_en);
            },
            render: (_, record) => {
                return <UnitCell unit={record.unit} />;
            },
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            key: 'shift',
            width: 180,
            fixed: 'left',
            sorter: (a, b) => {
                return a?.details[0]?.shift?.tag.localeCompare(b?.details[0]?.shift?.tag);
            },
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <Calendar strokeWidth={1.5} className="w-4 h-4 text-purple-500 font-bold" />
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
            title: 'Date',
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
            title: 'Week',
            dataIndex: 'week',
            key: 'week',
            width: 100,
            sorter: (a, b) => {
                return a?.details[0]?.date?.localeCompare(b?.details[0]?.date);
            },
            render: (_, record) => {
                return <div className="text-nowrap">{getDayOfWeek(record?.details[0]?.date)}</div>;
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
            render: (_, record) => {
                const time1 = record?.details[0]?.workday?.T1?.time;
                const time2 = record?.details[0]?.workday?.T2?.time;

                if (time1 && !time2) {
                    return (
                        <button className="text-nowrap flex items-center gap-2 cursor-pointer">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-red-600">
                                {formatTimeHHmm(time1)}
                            </span>
                        </button>
                    );
                } else if (time1 && time2) {
                    return (
                        <button className="text-nowrap flex items-center gap-2 cursor-pointer">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-purple-600">
                                {formatTimeHHmm(time1)}
                            </span>
                        </button>
                    );
                }

                return null;
            },
        },
        {
            title: 'T2',
            dataIndex: 't2',
            key: 't2',
            width: 70,
            sorter: (a, b) => {
                return (
                    (a?.details[0]?.workday?.T2?.time || 0) -
                    (b?.details[0]?.workday?.T2?.time || 0)
                );
            },
            render: (_, record) => {
                const time1 = record?.details[0]?.workday?.T1?.time;
                const time2 = record?.details[0]?.workday?.T2?.time;

                if (time1 && !time2) {
                    return (
                        <button className="text-nowrap flex items-center gap-2 cursor-pointer">
                            {time2 ? <Eye className="w-4 h-4 text-blue-600" /> : null}
                            <span className="font-medium text-red-600">
                                {time2 ? formatTimeHHmm(time2) : null}
                            </span>
                        </button>
                    );
                } else if (time1 && time2) {
                    return (
                        <button className="text-nowrap flex items-center gap-2 cursor-pointer">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-purple-600">
                                {formatTimeHHmm(time2)}
                            </span>
                        </button>
                    );
                }

                return null;
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
                    a?.details[0]?.workday?.overtime?.c150 - b?.details[0]?.workday?.overtime?.c150
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
                    a?.details[0]?.workday?.overtime?.c200 - b?.details[0]?.workday?.overtime?.c200
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
                    a?.details[0]?.workday?.overtime?.c300 - b?.details[0]?.workday?.overtime?.c300
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
                    a?.details[0]?.workday?.leave_hours.A - b?.details[0]?.workday?.leave_hours.A
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
            sorter: (a, b) => {
                return a?.details[0]?.workday?.KP - b?.details[0]?.workday?.KP;
            },
            render: (_, record) => {
                return (
                    <div className="text-nowrap text-center font-medium">
                        {record?.details[0]?.workday?.KP > 0
                            ? record?.details[0]?.workday?.KP
                            : '-'}
                    </div>
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
                    a?.details[0]?.workday?.leave_hours.B - b?.details[0]?.workday?.leave_hours.B
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
            render: (_, record) => {
                const isPregnant = CheckInPregnancyOrTakeCareChild(
                    record?.pregnancy?.start_date,
                    record?.pregnancy?.end_date,
                    record?.details[0]?.date,
                );
                const isTakeCareChild = CheckInPregnancyOrTakeCareChild(
                    record?.has_children?.start_date,
                    record?.has_children?.end_date,
                    record?.details[0]?.date,
                );

                if (isPregnant) {
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Users className="w-4 h-4 text-red-500" />{' '}
                            <p className="text-red-500"> MT</p>
                        </div>
                    );
                }
                if (isTakeCareChild) {
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Baby className="w-4 h-4 text-blue-500" />{' '}
                            <p className="text-blue-500"> CN</p>
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
            title: 'Actions',
            key: 'operation',
            fixed: 'right',
            width: 50,
            render: () => {
                return (
                    <Popover
                        content={
                            <div className="flex flex-col gap-2">
                                <button className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 duration-300">
                                    <Paperclip className="w-4 h-4 text-orange-500" />
                                    <span>{t.workday.logs}</span>
                                </button>
                                <button className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 duration-300">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span>{t.workday.abnormal_process}</span>
                                </button>
                                <button className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 duration-300">
                                    <ClockAlert className="w-4 h-4 text-blue-500" />
                                    <span>{t.workday.edit_clock}</span>
                                </button>
                                <button className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 duration-300">
                                    <Home className="w-4 h-4 text-green-700" />
                                    <span>{t.workday.take_leave}</span>
                                </button>
                                <button className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 duration-300">
                                    <Clock className="w-4 h-4 text-purple-500" />
                                    <span>{t.workday.overtime}</span>
                                </button>
                            </div>
                        }
                        trigger="click"
                    >
                        <Button>
                            <Settings className="w-4 h-4 text-green-700" />
                        </Button>
                    </Popover>
                );
            },
        },
    ];
};
