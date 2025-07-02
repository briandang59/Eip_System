import { ShiftType } from '@/types/response/shiftType';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useShiftCols = (): TableColumnsType<ShiftType> => {
    const { t } = useTranslationCustom();
    const PeriodCell = ({ period }: { period: ShiftType['period_id'] }) => {
        if (!period) return <div>-</div>;
        const periodName = useChangeLanguage(period.name_en, period.name_zh, period.name_vn);
        return <div>{periodName}</div>;
    };
    return [
        {
            title: 'Stt',
            width: 60,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Tên ca làm việc',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (_, record: ShiftType) => (
                <div className="line-clamp-2">{record?.tag || '-'}</div>
            ),
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_time',
            key: 'start_time',
            width: 200,
            render: (_, record: ShiftType) => (
                <div className="line-clamp-2">{record?.start_time || '-'}</div>
            ),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'end_time',
            key: 'end_time',
            width: 200,
            render: (_, record: ShiftType) => (
                <div className="line-clamp-2">{record?.end_time || '-'}</div>
            ),
        },
        {
            title: 'Thời gian nghỉ',
            dataIndex: 'break_time',
            key: 'break_time',
            width: 200,
            render: (_, record: ShiftType) => (
                <div className="line-clamp-2">
                    {record?.break_time?.start || '-'} - {record?.break_time?.end || '-'}
                </div>
            ),
        },
        {
            title: 'Ca',
            dataIndex: 'period_id',
            key: 'period_id',
            width: 200,
            render: (_, record: ShiftType) => <PeriodCell period={record?.period_id} />,
        },
        {
            title: 'Địa điểm',
            dataIndex: 'location',
            key: 'location',
            width: 200,
            render: (_, record: ShiftType) => (
                <div className="line-clamp-2">{record?.location || '-'}</div>
            ),
        },
        {
            title: t.utils.actions,
            dataIndex: 'action',
            key: 'action',
            width: 200,
            render: (text: string) => <div className="line-clamp-2">{text}</div>,
            fixed: 'right',
        },
    ];
};
