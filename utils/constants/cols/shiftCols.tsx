import { ShiftType } from '@/types/response/shiftType';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType } from 'antd';
import { Pen, Settings, Trash } from 'lucide-react';

interface params {
    open: (key: string, record: ShiftType) => void;
}
export const useShiftCols = ({ open }: params): TableColumnsType<ShiftType> => {
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
            title: t.utils.tag,
            dataIndex: 'tag',
            key: 'tag',
            width: 200,
            render: (_, record: ShiftType) => (
                <div className="line-clamp-2">{record?.tag || '-'}</div>
            ),
        },
        {
            title: t.utils.start_time,
            dataIndex: 'start_time',
            key: 'start_time',
            width: 200,
            render: (_, record: ShiftType) => (
                <div className="line-clamp-2">{record?.start_time || '-'}</div>
            ),
        },
        {
            title: t.utils.end_time,
            dataIndex: 'end_time',
            key: 'end_time',
            width: 200,
            render: (_, record: ShiftType) => (
                <div className="line-clamp-2">{record?.end_time || '-'}</div>
            ),
        },
        {
            title: t.utils.break_time,
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
            title: t.utils.period,
            dataIndex: 'period_id',
            key: 'period_id',
            width: 200,
            render: (_, record: ShiftType) => <PeriodCell period={record?.period_id} />,
        },
        {
            title: t.utils.location,
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
            render: (_, record: ShiftType) => (
                <div>
                    <Popover
                        trigger={'click'}
                        content={
                            <div className="flex flex-col gap-2">
                                <Button
                                    icon={<Pen className="size-[14px] !text-blue-700" />}
                                    onClick={() => open('modify', record)}
                                >
                                    {t.common.forms.edit}
                                </Button>
                                <Button
                                    icon={<Trash className="size-[14px] !text-red-700" />}
                                    onClick={() => open('delete', record)}
                                >
                                    {t.common.forms.delete}
                                </Button>
                            </div>
                        }
                    >
                        <Button icon={<Settings className="size-[14px] !text-green-700" />} />
                    </Popover>
                </div>
            ),
            fixed: 'right',
        },
    ];
};
