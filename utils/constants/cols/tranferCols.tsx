import { TransferEmployeesResponseType } from '@/types/response/transferEmployees';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useTransferCols = (): TableColumnsType<TransferEmployeesResponseType> => {
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
            title: t.transfer.card_number,
            dataIndex: 'card_number',
            key: 'card_number',
            width: 100,
            fixed: 'left',
        },
        {
            title: t.transfer.full_name,
            dataIndex: 'fullname',
            key: 'fullname',
            width: 200,
            fixed: 'left',
        },
        {
            title: t.transfer.gender,
            dataIndex: '',
            key: '',
            width: 100,
            fixed: 'left',
            render: (record: TransferEmployeesResponseType) => (
                <p>{record?.gender === true ? t.transfer.male : t.transfer.female}</p>
            ),
        },
        {
            title: t.transfer.date_join_company,
            dataIndex: 'join_company_date',
            key: 'join_company_date',
            width: 200,
        },
        {
            title: t.transfer.old_department,
            dataIndex: ['origin', 'service_unit', 'name_vn'],
            key: 'join_company_date',
            width: 200,
        },
        {
            title: t.transfer.old_factory,
            dataIndex: ['origin', 'work_place', 'name_en'],
            key: 'join_company_date',
            width: 200,
        },
        {
            title: t.transfer.transfer_date,
            dataIndex: ['transfer', 'event_date'],
            key: 'join_company_date',
            width: 200,
        },
        {
            title: t.transfer.new_department,
            dataIndex: ['transfer', 'service_unit', 'name_vn'],
            key: 'join_company_date',
            width: 200,
        },
        {
            title: t.transfer.transfer_factory,
            dataIndex: ['transfer', 'work_place', 'name_en'],
            key: 'join_company_date',
            width: 200,
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (text: string) => <div className="line-clamp-2">{text}</div>,
            fixed: 'right',
        },
    ];
};
