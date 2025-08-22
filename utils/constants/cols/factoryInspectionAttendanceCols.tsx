import { Button, TableColumnsType } from 'antd';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';
import { Baby, Calendar, Pen, Users } from 'lucide-react';
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

interface FactoryInspectionAttendancesProps {
    open: (record: FactoryInspectionAttendance) => void;
    selectedFactoryId?: number;
    systemModes?: { work_place: { id: number }; inspection: boolean }[];
}

export const useFactoryInspectionAttendanceCols = ({
    open,
    selectedFactoryId,
    systemModes,
}: FactoryInspectionAttendancesProps): TableColumnsType<FactoryInspectionAttendance> => {
    const { t } = useTranslationCustom();

    const isDisabledOperation = () => {
        const found = systemModes?.find(
            (m) => m.work_place.id === selectedFactoryId && m.inspection === true,
        );
        return Boolean(found);
    };

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
            sorter: (a, b) => a?.card_number?.localeCompare(b?.card_number),
        },
        {
            title: t.workday.fullname,
            dataIndex: 'fullname',
            key: 'fullname',
            width: 150,
            fixed: 'left',
            sorter: (a, b) => a?.fullname?.localeCompare(b?.fullname),
            render: (_, record) => <div className="text-nowrap">{record?.fullname}</div>,
        },
        {
            title: t.workday.unit,
            dataIndex: 'unit',
            key: 'unit',
            width: 100,
            fixed: 'left',
            render: (_, record) => <UnitCell unit={record.unit} />,
        },
        {
            title: t.workday.shift,
            dataIndex: 'shift',
            key: 'shift',
            width: 180,
            fixed: 'left',
            sorter: (a, b) => {
                const tagA = a.details?.[0]?.shift?.tag ?? '';
                const tagB = b.details?.[0]?.shift?.tag ?? '';
                return tagA.localeCompare(tagB);
            },
            render: (_, record) => (
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
            ),
        },
        {
            title: t.workday.date,
            dataIndex: 'date',
            key: 'date',
            width: 100,
            sorter: (a, b) => a?.details[0]?.date?.localeCompare(b?.details[0]?.date),
            render: (_, record) => (
                <div className="text-nowrap text-blue-500 font-medium">
                    {record?.details[0]?.date}
                </div>
            ),
        },
        {
            title: t.workday.week,
            dataIndex: 'week',
            key: 'week',
            width: 100,
            sorter: (a, b) => a?.details[0]?.date?.localeCompare(b?.details[0]?.date),
            render: (_, record) => (
                <div className="text-nowrap">{getDayOfWeek(record?.details[0]?.date)}</div>
            ),
        },
        // ... (các cột T1, T2, GC, NLE, overtime, leave_hours ... giữ nguyên như code gốc của bạn)
        {
            title: 'CTMTCN',
            dataIndex: 'CTMTCN',
            key: 'CTMTCN',
            width: 80,
            render: (_: any, record: FactoryInspectionAttendance) => {
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
            sorter: (a, b) =>
                a?.details[0]?.employee_class_code?.localeCompare(
                    b?.details[0]?.employee_class_code,
                ),
            render: (_, record) => (
                <div className="text-nowrap text-center">
                    {record?.details[0]?.employee_class_code}
                </div>
            ),
        },
        {
            title: 'PNTrua',
            dataIndex: 'PNTrua',
            key: 'PNTrua',
            width: 60,
            render: () => <div className="text-nowrap text-center">-</div>,
        },
        {
            title: 'PNTca',
            dataIndex: 'PNTca',
            key: 'PNTca',
            width: 60,
            render: () => <div className="text-nowrap text-center">-</div>,
        },
        {
            title: '',
            key: 'operation',
            fixed: 'right',
            width: 50,
            render: (_, record: FactoryInspectionAttendance) => {
                if (isDisabledOperation()) {
                    return null; // ẩn cột operation nếu inspection=true của factory hiện tại
                }
                return (
                    <Button
                        icon={<Pen strokeWidth={1.5} className="!text-blue-700 size-4" />}
                        onClick={() => open(record)}
                    />
                );
            },
        },
    ];
};
