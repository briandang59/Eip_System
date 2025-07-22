import { SalaryAllowance } from '@/types/response/salaryAllowance';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useSalaryAllowanceCols = (): TableColumnsType<SalaryAllowance> => {
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
            title: t.salary_allowance.card_number,
            dataIndex: ['employee', 'card_number'],
            key: 'card_number',
            width: 100,
        },
        {
            title: t.salary_allowance.fullname,
            dataIndex: ['employee', 'fullname'],
            key: 'fullname',
            width: 200,
        },
        {
            title: t.salary_allowance.date_join_company,
            dataIndex: ['employee', 'join_company_date1'],
            key: 'join_company_date1',
            width: 100,
        },
        {
            title: t.salary_allowance.unit,
            dataIndex: ['employee', 'unit', 'name_vn'],
            key: 'unit',
            width: 100,
        },
        {
            title: t.salary_allowance.probationary_salary,
            dataIndex: 'probationary_salary',
            key: 'probationary_salary',
            width: 100,
        },
        {
            title: t.salary_allowance.base_salary,
            dataIndex: 'base_salary',
            key: 'base_salary',
            width: 100,
        },
        {
            title: t.salary_allowance.education_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.environment_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.special_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.computer_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.language_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.machanical_repair_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.office_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.manage_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.position_allowance,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: `KPI-2`,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.total_base_salary,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: t.salary_allowance.total_probationary_salary,
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
    ];
};
