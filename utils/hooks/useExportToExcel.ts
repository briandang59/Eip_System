import { useCallback } from 'react';
import { TableColumnsType } from 'antd';
import {
    exportToExcel,
    exportToExcelWithSummary,
    exportToExcelWithoutSummary,
} from '@/utils/functions/exportToExcel';

export interface UseExportToExcelReturn<T> {
    exportBasic: (data: T[], filename?: string) => void;
    exportWithSummary: (data: T[], summaryData: Record<string, any>, filename?: string) => void;
    exportWithoutSummary: (data: T[], filename?: string) => void;
}

/**
 * Generic hook for exporting table data to Excel
 * @param columns - Antd table columns configuration
 * @param defaultFilename - Default filename prefix
 * @param sheetName - Excel sheet name
 * @returns Object with export functions
 */
export function useExportToExcel<T extends Record<string, any>>(
    columns: TableColumnsType<T>,
    defaultFilename: string = 'table_export',
    sheetName: string = 'Sheet1',
): UseExportToExcelReturn<T> {
    const exportBasic = useCallback(
        (data: T[], filename?: string) => {
            if (!data || data.length === 0) {
                console.warn('No data to export');
                return;
            }

            const finalFilename = filename || defaultFilename;
            exportToExcel(data, columns, finalFilename, sheetName);
        },
        [columns, defaultFilename, sheetName],
    );

    const exportWithSummary = useCallback(
        (data: T[], summaryData: Record<string, any>, filename?: string) => {
            if (!data || data.length === 0) {
                console.warn('No data to export');
                return;
            }

            const finalFilename = filename || `${defaultFilename}_with_summary`;
            exportToExcelWithSummary(data, columns, summaryData, finalFilename, sheetName);
        },
        [columns, defaultFilename, sheetName],
    );

    const exportWithoutSummary = useCallback(
        (data: T[], filename?: string) => {
            if (!data || data.length === 0) {
                console.warn('No data to export');
                return;
            }

            const finalFilename = filename || `${defaultFilename}_data_only`;
            exportToExcelWithoutSummary(data, columns, finalFilename, sheetName);
        },
        [columns, defaultFilename, sheetName],
    );

    return {
        exportBasic,
        exportWithSummary,
        exportWithoutSummary,
    };
}

/**
 * Hook specifically for statistical workday export with auto-generated filename
 */
export function useStatisticalWorkdayExport<T extends Record<string, any>>(
    columns: TableColumnsType<T>,
    workPlaces?: Array<{ id: number; name_en: string }>,
    selectedMonth?: any,
    selectWorkPlace?: number | null,
    status?: string,
) {
    const generateFilename = useCallback(() => {
        const monthText = selectedMonth?.format('YYYY-MM') || 'Unknown';
        const workplaceName =
            workPlaces?.find((wp) => wp.id === selectWorkPlace)?.name_en || 'AllWorkplaces';
        const statusText = status || 'all';
        return `StatisticalWorkday_${monthText}_${workplaceName}_${statusText}`;
    }, [workPlaces, selectedMonth, selectWorkPlace, status]);

    const { exportBasic, exportWithSummary, exportWithoutSummary } = useExportToExcel(
        columns,
        'StatisticalWorkday',
        selectedMonth?.format('YYYY-MM') || 'Statistical Workday',
    );

    const exportData = useCallback(
        (data: T[], summaryData?: Record<string, any>) => {
            const filename = generateFilename();
            if (summaryData) {
                exportWithSummary(data, summaryData, filename);
            } else {
                exportBasic(data, filename);
            }
        },
        [exportBasic, exportWithSummary, generateFilename],
    );

    const exportDataOnly = useCallback(
        (data: T[]) => {
            const filename = generateFilename();
            exportWithoutSummary(data, filename);
        },
        [exportWithoutSummary, generateFilename],
    );

    return {
        exportData,
        exportDataOnly,
        exportBasic,
        exportWithSummary,
        exportWithoutSummary,
    };
}
