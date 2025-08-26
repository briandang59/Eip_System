import { FormApprovalResponse } from '@/types/response/formRequest';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Button, TableColumnsType, Tag } from 'antd';
import { CheckCheck, X } from 'lucide-react';

interface Params {
    handleApprove: (key: string, record: FormApprovalResponse) => void;
}

export const useRecordFormCols = ({
    handleApprove,
}: Params): TableColumnsType<FormApprovalResponse> => {
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
            render: (_, record: FormApprovalResponse) => (
                <div className="line-clamp-2">{record?.request?.applicant.fullname ?? '-'}</div>
            ),
        },
        {
            title: t.record_form.form,
            dataIndex: 'form',
            key: 'form',
            width: 200,
            render: (_, record: FormApprovalResponse) => (
                <div className="line-clamp-2">{record?.request.form_type_id ?? '-'}</div>
            ),
        },

        {
            title: t.record_form.status,
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (_, record: FormApprovalResponse) => (
                <Tag color="orange">{record?.request?.status_name ?? '-'}</Tag>
            ),
        },

        {
            title: t.utils.actions,
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (_, record: FormApprovalResponse) => (
                <div className="flex items-center gap-2">
                    <Button
                        icon={<CheckCheck className="size-[14px] !text-green-700" />}
                        className="!text-green-700"
                        onClick={() => handleApprove('approve', record)}
                    >
                        {t.common.forms.accept}
                    </Button>
                    <Button
                        icon={<X className="size-[14px] !text-red-700" />}
                        className="!text-red-700"
                        onClick={() => handleApprove('dismiss', record)}
                    >
                        {t.common.forms.dismiss}
                    </Button>
                </div>
            ),
            fixed: 'right',
        },
    ];
};
