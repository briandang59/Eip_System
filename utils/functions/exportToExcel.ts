import * as XLSX from 'xlsx';
import { TableColumnsType } from 'antd';

/**
 * Generic Excel export function for any table data
 * @param data - Array of data to export (full data, not paginated)
 * @param columns - Antd table columns configuration
 * @param filename - Optional filename, defaults to 'export'
 * @param sheetName - Optional sheet name, defaults to 'Sheet1'
 */
export function exportToExcel<T extends Record<string, any>>(
    data: T[],
    columns: TableColumnsType<T>,
    filename: string = 'export',
    sheetName: string = 'Sheet1',
) {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Extract headers from columns
    const headers = columns
        .filter((col) => {
            const key = col.key as string;
            return !['actions', 'operation', 'action'].includes(key) && !col.hidden;
        })
        .map((col) => {
            // Handle nested title (could be ReactNode)
            if (typeof col.title === 'string') {
                return col.title;
            } else if (typeof col.title === 'function') {
                return col.key?.toString() || 'Unknown';
            } else {
                return col.key?.toString() || 'Unknown';
            }
        });

    // Extract data rows with correct column order
    const orderedRows = data.map((item, index) => {
        const orderedRow: any[] = [];

        columns
            .filter((col) => {
                const key = col.key as string;
                return !['actions', 'operation', 'action'].includes(key) && !col.hidden;
            })
            .forEach((col) => {
                const key = col.key as string;
                const dataIndex =
                    'dataIndex' in col ? (col.dataIndex as string | string[]) : undefined;

                let value = '';

                // Special handling for unit column
                if (key === 'unit' && dataIndex === 'unit') {
                    const unit = getNestedValue(item, dataIndex);
                    if (unit && typeof unit === 'object') {
                        // Try to get localized unit name - fallback to English
                        value = unit.name_en || unit.name_zh || unit.name_vn || '';
                    } else {
                        value = unit || '';
                    }
                }
                // Handle custom render function for other columns
                else if ((col as any).render && typeof (col as any).render === 'function') {
                    try {
                        const renderedValue = (col as any).render(
                            dataIndex ? getNestedValue(item, dataIndex) : item[key],
                            item,
                            index,
                        );

                        // Extract text from JSX elements
                        if (typeof renderedValue === 'object' && renderedValue) {
                            value = extractTextFromReactElement(renderedValue);
                        } else if (
                            typeof renderedValue === 'string' ||
                            typeof renderedValue === 'number'
                        ) {
                            value = renderedValue.toString();
                        } else {
                            value = dataIndex ? getNestedValue(item, dataIndex) : item[key] || '';
                        }
                    } catch (error) {
                        // Fallback to raw data if render fails
                        value = dataIndex ? getNestedValue(item, dataIndex) : item[key] || '';
                    }
                } else {
                    // Use raw data
                    value = dataIndex ? getNestedValue(item, dataIndex) : item[key] || '';
                }

                // Convert to string and handle special cases
                if (value === null || value === undefined) {
                    value = '';
                } else if (typeof value === 'object') {
                    value = JSON.stringify(value);
                } else {
                    value = value.toString();
                }

                orderedRow.push(value);
            });

        return orderedRow;
    });

    // Create workbook and worksheet with correct column order
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...orderedRows]);

    // Set column widths
    const colWidths = headers.map((header) => ({ wch: Math.max(header.length, 15) }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const finalFilename = `${filename}_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, finalFilename);
}

/**
 * Export table without summary/totals row - just pure data
 * @param data - Array of data to export
 * @param columns - Antd table columns configuration
 * @param filename - Optional filename
 * @param sheetName - Optional sheet name
 */
export function exportToExcelWithoutSummary<T extends Record<string, any>>(
    data: T[],
    columns: TableColumnsType<T>,
    filename: string = 'export_data_only',
    sheetName: string = 'Sheet1',
) {
    // Use the basic export function which doesn't add summary
    exportToExcel(data, columns, filename, sheetName);
}

/**
 * Helper function to get nested values from object
 */
function getNestedValue(obj: any, path: string | string[]): any {
    if (typeof path === 'string') {
        return obj[path];
    }

    return path.reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : '';
    }, obj);
}

/**
 * Helper function to extract text from React elements
 */
function extractTextFromReactElement(element: any): string {
    if (typeof element === 'string' || typeof element === 'number') {
        return element.toString();
    }

    if (element?.props?.children) {
        if (
            typeof element.props.children === 'string' ||
            typeof element.props.children === 'number'
        ) {
            return element.props.children.toString();
        }

        if (Array.isArray(element.props.children)) {
            return element.props.children
                .map((child: any) => extractTextFromReactElement(child))
                .filter(Boolean)
                .join(' ');
        }

        return extractTextFromReactElement(element.props.children);
    }

    return '';
}

/**
 * Export table with summary/totals row
 * @param data - Array of data to export
 * @param columns - Antd table columns configuration
 * @param summaryData - Summary/totals data object
 * @param filename - Optional filename
 * @param sheetName - Optional sheet name
 */
export function exportToExcelWithSummary<T extends Record<string, any>>(
    data: T[],
    columns: TableColumnsType<T>,
    summaryData: Record<string, any>,
    filename: string = 'export_with_summary',
    sheetName: string = 'Sheet1',
) {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Create regular export first
    const headers = columns
        .filter((col) => {
            const key = col.key as string;
            return !['actions', 'operation', 'action'].includes(key) && !col.hidden;
        })
        .map((col) => col.title as string);

    const orderedRows = data.map((item, index) => {
        const orderedRow: any[] = [];
        columns
            .filter((col) => {
                const key = col.key as string;
                return !['actions', 'operation', 'action'].includes(key) && !col.hidden;
            })
            .forEach((col) => {
                const key = col.key as string;
                const dataIndex =
                    'dataIndex' in col ? (col.dataIndex as string | string[]) : undefined;

                let value = '';

                // Special handling for unit column
                if (key === 'unit' && dataIndex === 'unit') {
                    const unit = getNestedValue(item, dataIndex);
                    if (unit && typeof unit === 'object') {
                        // Try to get localized unit name - fallback to English
                        value = unit.name_en || unit.name_zh || unit.name_vn || '';
                    } else {
                        value = unit || '';
                    }
                }
                // Handle custom render function for other columns
                else if ((col as any).render && typeof (col as any).render === 'function') {
                    try {
                        const renderedValue = (col as any).render(
                            dataIndex ? getNestedValue(item, dataIndex) : item[key],
                            item,
                            index,
                        );
                        value = extractTextFromReactElement(renderedValue);
                    } catch (error) {
                        value = dataIndex ? getNestedValue(item, dataIndex) : item[key] || '';
                    }
                } else {
                    value = dataIndex ? getNestedValue(item, dataIndex) : item[key] || '';
                }

                if (value === null || value === undefined) {
                    value = '';
                } else if (typeof value === 'object') {
                    value = JSON.stringify(value);
                } else {
                    value = value.toString();
                }

                orderedRow.push(value);
            });
        return orderedRow;
    });

    // Add summary row with correct column order
    const summaryRow: any[] = [];
    columns
        .filter((col) => {
            const key = col.key as string;
            return !['actions', 'operation', 'action'].includes(key) && !col.hidden;
        })
        .forEach((col, index) => {
            if (index === 0) {
                summaryRow.push('TỔNG CỘNG'); // Total label
            } else {
                const key = col.key as string;
                const value = summaryData[key] && summaryData[key] > 0 ? summaryData[key] : '';
                summaryRow.push(value);
            }
        });

    orderedRows.push(summaryRow);

    // Create workbook with correct column order
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...orderedRows]);

    // Set column widths
    const colWidths = headers.map((header) => ({ wch: Math.max(header.length, 15) }));
    ws['!cols'] = colWidths;

    // Style the summary row (last row)
    const lastRowIndex = orderedRows.length;
    headers.forEach((_, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: lastRowIndex - 1, c: colIndex });
        if (!ws[cellAddress]) ws[cellAddress] = { v: '', t: 's' };
        ws[cellAddress].s = {
            font: { bold: true, color: { rgb: '0000FF' } },
            fill: { fgColor: { rgb: 'F0F0F0' } },
        };
    });

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const finalFilename = `${filename}_${timestamp}.xlsx`;

    XLSX.writeFile(wb, finalFilename);
}
