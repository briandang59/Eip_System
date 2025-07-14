import { CareerHistoryResponseType } from '@/types/response/dailyCareerRecord';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, TableColumnsType } from 'antd';
import { Pen } from 'lucide-react';

export const useDailyCareerRecordCols = (): TableColumnsType<CareerHistoryResponseType> => {
    const { t } = useTranslationCustom();

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
            title: t.record.event,
            key: 'career_event',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">{record.career_event?.name_en || '-'}</div>
            ),
        },
        {
            title: t.record.card_number,
            dataIndex: 'card_number',
            key: 'card_number',
            width: 200,
            render: (text: string) => <div className="line-clamp-2">{text || '-'}</div>,
        },
        {
            title: t.record.date,
            dataIndex: 'event_date',
            key: 'event_date',
            width: 200,
            render: (text: string) => <div className="line-clamp-2">{text || '-'}</div>,
        },
        {
            title: t.record.workplace,
            key: 'work_place',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">{record.work_place?.name_en || '-'}</div>
            ),
        },
        {
            title: t.record.department,
            key: 'service_unit',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">{record.service_unit?.name_en || '-'}</div>
            ),
        },
        {
            title: t.record.job_title,
            key: 'job_title',
            width: 200,
            render: (_, record) => (
                <div className="line-clamp-2">{record.job_title?.name_vn || '-'}</div>
            ),
        },
        {
            title: t.record.resign_reason,
            dataIndex: 'reason',
            key: 'reason',
            width: 200,
            render: (text: string) => <div className="line-clamp-2">{text || '-'}</div>,
        },
        {
            title: t.record.memo,
            dataIndex: 'memo',
            key: 'memo',
            width: 200,
            render: (text: string) => <div className="line-clamp-2">{text || '-'}</div>,
        },

        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: () => <Button icon={<Pen className="size-4 !text-blue-700" />}></Button>,
            fixed: 'right',
        },
    ];
};
