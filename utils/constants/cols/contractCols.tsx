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
            title: t.social_insurance.card_number,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.full_name,
            dataIndex: ['employee', 'fullname'],
            key: 'fullname',
            width: 100,
        },
        {
            title: t.social_insurance.date_join_company_1,
            dataIndex: ['employee', 'join_company_date1'],
            key: 'join_company_date1',
            width: 100,
        },
        {
            title: t.social_insurance.date_join_company_2,
            dataIndex: ['employee', 'join_company_date2'],
            key: 'join_company_date2',
            width: 100,
        },
        {
            title: t.social_insurance.unit,
            dataIndex: ['employee', 'unit', 'code'],
            key: 'code',
            width: 100,
        },
        {
            title: t.contract.now,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.year,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.count,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.base_salary,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.position,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.kpi,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.status,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.position,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.contract.kpi,
            dataIndex: [''],
            key: 'card_number',
            width: 100,
        },
    ];
};
