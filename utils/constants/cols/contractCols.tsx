import { SalaryAllowance } from '@/types/response/salaryAllowance';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useContractCols = (): TableColumnsType<any> => {
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
            title: t.contract.card_number,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.full_name,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.date_join_company1,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.date_join_company2,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.unit,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.now,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.year,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.count,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.base_salary,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.position,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.kpi,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.status,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.position,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.kpi,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
    ];
};
