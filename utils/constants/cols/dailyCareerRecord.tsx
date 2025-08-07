import { CareerHistoryResponseType } from '@/types/response/dailyCareerRecord';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, TableColumnsType } from 'antd';
import { Pen } from 'lucide-react';

const renderLocalizedField = (
    field: { name_en?: string; name_zh?: string; name_vn?: string } | number | null | undefined,
    lang: string,
) => {
    if (!field) return '-';
    if (typeof field === 'number') return field.toString();
    return getLocalizedName(field.name_en || '', field.name_zh || '', field.name_vn || '', lang);
};

export const useDailyCareerRecordCols = (
    setSelectedRecord: (record: CareerHistoryResponseType) => void,
): TableColumnsType<CareerHistoryResponseType> => {
    const { t, lang } = useTranslationCustom();

    return [
        {
            title: 'Stt',
            width: 60,
            key: 'stt',
            fixed: 'left',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t.record.event,
            key: 'career_event',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">
                    {renderLocalizedField(record?.career_event, lang)}
                </div>
            ),
        },
        {
            title: t.record.card_number,
            key: 'card_number',
            width: 200,
            render: (_, record) => <div className="line-clamp-2">{record?.card_number || '-'}</div>,
        },
        {
            title: t.record.date,
            key: 'event_date',
            width: 200,
            render: (_, record) => <div className="line-clamp-2">{record?.event_date || '-'}</div>,
        },
        {
            title: t.record.workplace,
            key: 'work_place',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">{renderLocalizedField(record?.work_place, lang)}</div>
            ),
        },
        {
            title: t.record.department,
            key: 'service_unit',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">
                    {renderLocalizedField(record?.service_unit, lang)}
                </div>
            ),
        },
        {
            title: t.record.job_title,
            key: 'job_title',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">{renderLocalizedField(record?.job_title, lang)}</div>
            ),
        },
        {
            title: t.record.resign_reason,
            key: 'reason',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">
                    {record?.reason
                        ? typeof record.reason === 'string'
                            ? record.reason
                            : record.reason.name_vn ||
                              record.reason.name_en ||
                              record.reason.name_zh ||
                              '-'
                        : '-'}
                </div>
            ),
        },
        {
            title: t.record.memo,
            key: 'memo',
            width: 200,
            render: (_, record) => <div className="line-clamp-2">{record?.memo || '-'}</div>,
        },

        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (_, record: CareerHistoryResponseType) => (
                <Button
                    icon={<Pen className="size-4 !text-blue-700" />}
                    onClick={() => setSelectedRecord(record)}
                ></Button>
            ),
            fixed: 'right',
        },
    ];
};
