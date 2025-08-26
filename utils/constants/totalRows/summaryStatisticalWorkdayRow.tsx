import { Table } from 'antd';
import { StatisticalWorkdayType } from '@/types/response/attendance';
import { formatNumber } from '@/utils/functions/formatNumber';

const calculateTotals = (data: StatisticalWorkdayType[]) => {
    return data.reduce(
        (totals, record) => {
            totals.total_GC += record.total_GC || 0;
            totals.total_NLE += record.total_NLE || 0;
            totals.total_150 += record.total_150 || 0;
            totals.total_200 += record.total_200 || 0;
            totals.total_300 += record.total_300 || 0;
            totals.total_390 += record.total_390 || 0;
            totals.total_400 += record.total_400 || 0;
            totals.total_A += record.total_A || 0;
            totals.total_B += record.total_B || 0;
            totals.total_KP += record.total_KP || 0;
            totals.total_C += record.total_C || 0;
            totals.total_DB += record.total_DB || 0;
            totals.total_CV += record.total_CV || 0;
            totals.total_DT += record.total_DT || 0;
            totals.total_VS += record.total_VS || 0;
            totals.total_G200 += record.total_G200 || 0;
            totals.total_G210 += record.total_G210 || 0;
            totals.total_Gdem += record.total_Gdem || 0;
            totals.total_CCAN += record.total_CCAN || 0;
            totals.total_Tcom += record.total_Tcom || 0;
            totals.total_MonthH += record.total_MonthH || 0;
            totals.total_HChuan += record.total_HChuan || 0;
            totals.total_SGC += record.total_SGC || 0;
            totals.total_AllH += record.total_AllH || 0;
            return totals;
        },
        {
            total_GC: 0,
            total_NLE: 0,
            total_150: 0,
            total_200: 0,
            total_300: 0,
            total_390: 0,
            total_400: 0,
            total_A: 0,
            total_B: 0,
            total_KP: 0,
            total_C: 0,
            total_DB: 0,
            total_CV: 0,
            total_DT: 0,
            total_VS: 0,
            total_G200: 0,
            total_G210: 0,
            total_Gdem: 0,
            total_CCAN: 0,
            total_Tcom: 0,
            total_MonthH: 0,
            total_HChuan: 0,
            total_SGC: 0,
            total_AllH: 0,
        },
    );
};

export const summaryStatisticalWorkdayRow = (
    pageData: readonly StatisticalWorkdayType[],
    t: any,
) => {
    const currentTotals = calculateTotals(pageData as StatisticalWorkdayType[]);

    return (
        <Table.Summary fixed>
            <Table.Summary.Row style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                {/* STT */}
                <Table.Summary.Cell index={0} align="center">
                    <div className="font-bold text-blue-600">{t.workday.total}</div>
                </Table.Summary.Cell>
                {/* Card Number */}
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                {/* Full Name */}
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                {/* Unit */}
                <Table.Summary.Cell index={3}></Table.Summary.Cell>

                {/* Các cột số liệu */}
                <Table.Summary.Cell index={4} align="center">
                    {currentTotals.total_GC || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="center">
                    {currentTotals.total_NLE || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="center">
                    {currentTotals.total_150 || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="center">
                    {currentTotals.total_200 || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} align="center">
                    {currentTotals.total_300 || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} align="center">
                    {currentTotals.total_390 || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10} align="center">
                    {currentTotals.total_400 || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11} align="center">
                    {currentTotals.total_A || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12} align="center">
                    {currentTotals.total_KP || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={13} align="center">
                    {currentTotals.total_B || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={14} align="center">
                    {currentTotals.total_C || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={15} align="center">
                    {currentTotals.total_DB || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={16} align="center">
                    {currentTotals.total_CV || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={17} align="center">
                    {currentTotals.total_DT ? formatNumber(currentTotals.total_DT) : '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={18} align="center">
                    {currentTotals.total_VS ? formatNumber(currentTotals.total_VS) : '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={19} align="center">
                    {currentTotals.total_G200 || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={20} align="center">
                    {currentTotals.total_G210 || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={21} align="center">
                    {currentTotals.total_Gdem || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={22} align="center">
                    {currentTotals.total_CCAN ? formatNumber(currentTotals.total_CCAN) : '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={23} align="center">
                    {currentTotals.total_Tcom ? formatNumber(currentTotals.total_Tcom) : '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={24} align="center">
                    {currentTotals.total_MonthH || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={25} align="center">
                    {currentTotals.total_HChuan || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={26} align="center">
                    {currentTotals.total_SGC || '-'}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={27} align="center">
                    {currentTotals.total_AllH || '-'}
                </Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    );
};
