import { TakeLeaveResponseType } from '@/types/response/takeLeave';
import { useChangeLanguage } from '@/utils/hooks/useChangeLanguage';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';
import dayjs from 'dayjs';

export const useTakeLeaveCols = (): TableColumnsType<TakeLeaveResponseType> => {
    const { t } = useTranslationCustom();
    const LeaveCell = ({ period }: { period: TakeLeaveResponseType['leave_type'] }) => {
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
            title: t.take_leave.card_number,
            dataIndex: 'card_number',
            key: 'card_number',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">{record?.card_number || '-'}</div>
            ),
        },
        {
            title: t.take_leave.full_name,
            dataIndex: 'full_name',
            key: 'full_name',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">{record?.applicant.fullname || '-'}</div>
            ),
        },
        {
            title: t.take_leave.unit,
            dataIndex: 'end_time',
            key: 'end_time',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">{record?.applicant.unit.name_en || '-'}</div>
            ),
        },
        {
            title: t.take_leave.start_time,
            dataIndex: 'start_time',
            key: 'start_time',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">
                    {dayjs(record?.start).format('YYYY/MM/DD HH:mm') || '-'}
                </div>
            ),
        },
        {
            title: t.take_leave.end_time,
            dataIndex: 'end_time',
            key: 'end_time',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">
                    {dayjs(record?.end).format('YYYY/MM/DD HH:mm') || '-'}
                </div>
            ),
        },
        {
            title: t.take_leave.hours,
            dataIndex: 'hours',
            key: 'hours',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">{record?.hours || '-'}</div>
            ),
        },
        {
            title: t.take_leave.leave_type,
            dataIndex: 'leave_type',
            key: 'leave_type',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">
                    {record?.leave_type?.code} - {record?.leave_type?.name_vn}
                </div>
            ),
        },
        {
            title: t.take_leave.location,
            dataIndex: 'location',
            key: 'location',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">{record?.applicant?.job_title?.location || '-'}</div>
            ),
        },
        {
            title: t.take_leave.job_title,
            dataIndex: 'job_title',
            key: 'job_title',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">{record?.applicant?.job_title?.name_en || '-'}</div>
            ),
        },
        {
            title: t.take_leave.nation,
            dataIndex: 'nation',
            key: 'nation',
            width: 200,
            render: (_, record: TakeLeaveResponseType) => (
                <div className="line-clamp-2">{record?.applicant?.nation?.name_en || '-'}</div>
            ),
        },
    ];
};
