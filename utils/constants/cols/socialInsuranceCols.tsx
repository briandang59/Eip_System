import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useSocialInsuranceCols = (): TableColumnsType<any> => {
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
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.date_join_company_1,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.date_join_company_2,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.unit,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.join_insurance,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.initial_deduction_date,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.base_salary,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.social_insurance,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.unemployee_insurance,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.sum,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.social_insurance,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.unemployee_insurance,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.social_insurance.sum,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
    ];
};
