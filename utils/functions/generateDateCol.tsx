// utils/functions/generateDateCol.ts
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { clsx } from 'clsx';
import type { TableColumnsType } from 'antd';

interface GenColParams<T> {
    year: number;
    month: number;
    step: number;
    getAssignment: (card: string, day: string) => string | undefined;
    onCellClick: (cardNumber: string, day: string) => void;
}

export function generateDateColumns<T>({
    year,
    month,
    getAssignment,
    onCellClick,
}: GenColParams<T>): TableColumnsType<T> {
    const days = new Date(year, month, 0).getDate();
    const cols: TableColumnsType<T> = [];

    for (let d = 1; d <= days; d++) {
        const dayStr = d.toString().padStart(2, '0');
        const isSunday = new Date(year, month - 1, d).getDay() === 0;

        cols.push({
            title: dayStr,
            dataIndex: dayStr,
            key: dayStr,
            width: 50,
            onHeaderCell: () => ({
                className: clsx({
                    '!bg-red-500 !text-white': isSunday,
                }),
            }),
            onCell: (record: any) => {
                const assigned = getAssignment(record.card_number, dayStr);
                return {
                    className: clsx('cursor-pointer', {
                        'bg-green-200': !!assigned,
                        'bg-red-300': !!assigned && assigned === 'unshift',
                        'bg-red-100': !assigned && isSunday,
                        'hover:bg-yellow-100': !assigned,
                    }),
                    onClick: () => onCellClick(record.card_number, dayStr),
                };
            },
            render: (_v, record: any) => {
                const manual = getAssignment(record.card_number, dayStr);
                if (manual) return manual;
                const origin = record[dayStr];
                return origin ? <span className="text-green-700">{origin}</span> : '';
            },
            sorter: (a: T, b: T) => {
                const aValue = (a as any)[dayStr] || '';
                const bValue = (b as any)[dayStr] || '';
                return aValue.localeCompare(bValue);
            },
        });
    }

    return cols;
}
