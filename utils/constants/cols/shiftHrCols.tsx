// utils/constants/cols/useShiftHrCols.ts
import { generateDateColumns } from '@/utils/functions/generateDateCol';
import type { TableColumnsType } from 'antd';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { EmployeeRow } from '@/utils/functions/mergeShiftDate';
import { useMemo } from 'react';

interface Params {
    year: number;
    month: number;
    step: number;
    getAssignment: (card: string, day: string) => string | undefined;
    onCellClick: (card: string, day: string) => void;
}

export const useShiftHrCols = ({
    year,
    month,
    step,
    getAssignment,
    onCellClick,
}: Params): TableColumnsType<EmployeeRow> => {
    const { t } = useTranslationCustom();

    const fixed: TableColumnsType<EmployeeRow> = [
        {
            title: 'Stt',
            width: 60,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_t, _r, idx) => idx + 1,
        },
        {
            title: t.role_and_permission.card_number,
            dataIndex: 'card_number',
            key: 'card_number',
            width: 100,
            fixed: 'left',
            sorter: (a, b) => a.card_number.localeCompare(b.card_number),
        },
        {
            title: t.role_and_permission.fullname,
            dataIndex: ['fullname'],
            key: 'fullname',
            width: 150,
            fixed: 'left',
            sorter: (a, b) => a.fullname.localeCompare(b.fullname),
        },
    ];

    const dateColumns = useMemo(
        () => generateDateColumns<EmployeeRow>({ year, month, step, getAssignment, onCellClick }),
        [year, month, step, getAssignment, onCellClick],
    );

    return [...fixed, ...dateColumns];
};
