import { RecordFormResponse } from '@/types/response/recordForm';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, Popover, TableColumnsType, Tag } from 'antd';
import dayjs from 'dayjs';
import { Eye, Pen, Settings, Trash } from 'lucide-react';

export const useRecordFormCols = (): TableColumnsType<RecordFormResponse> => {
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
            title: t.record_form.applicant,
            dataIndex: 'applicant',
            key: 'applicant',
            width: 200,
            render: (_, record: RecordFormResponse) => (
                <div className="line-clamp-2">{record?.applicant?.fullname ?? '-'}</div>
            ),
        },
        {
            title: t.record_form.form,
            dataIndex: 'form',
            key: 'form',
            width: 200,
            render: (_, record: RecordFormResponse) => (
                <div className="line-clamp-2">{record?.type_name ?? '-'}</div>
            ),
        },
        {
            title: t.record_form.request_time,
            dataIndex: 'request_time',
            key: 'request_time',
            width: 200,
            render: (_, record: RecordFormResponse) => (
                <div className="line-clamp-2">
                    {dayjs(record?.createdAt).format('YYYY/MM/DD') ?? '-'}
                </div>
            ),
        },
        {
            title: t.record_form.status,
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (_, record: RecordFormResponse) => (
                <Tag color="orange">{record?.status?.name ?? '-'}</Tag>
            ),
        },
        {
            title: t.record_form.approvers,
            dataIndex: 'approvers',
            key: 'approvers',
            width: 100,
        },
        {
            title: t.utils.actions,
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (_, record: RecordFormResponse) => (
                <div>
                    <Popover
                        trigger={'click'}
                        content={
                            <div className="flex flex-col gap-2">
                                <Button
                                    icon={<Eye className="size-[14px] !text-green-700" />}
                                    // onClick={() => open('modify', record)}
                                >
                                    View
                                </Button>
                                <Button
                                    icon={<Pen className="size-[14px] !text-blue-700" />}
                                    // onClick={() => open('modify', record)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    icon={<Trash className="size-[14px] !text-red-700" />}
                                    // onClick={() => open('delete', record)}
                                >
                                    Remove
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
