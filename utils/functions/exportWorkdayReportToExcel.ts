import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { DataReportType } from '../hooks/useDataReport';
import { logos } from '../printing/basePdf';

export const exportWorkdayReportToExcel = async (data: DataReportType[], month: string) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Workday Report');

    // Load the logo
    const logoBytes = await fetch(logos.logo_report).then((res) => res.arrayBuffer());
    const logoImageId = workbook.addImage({
        buffer: logoBytes,
        extension: 'png', // Adjust to 'jpeg' if the logo is a JPEG
    });

    const headerFill: ExcelJS.Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0066CC' },
    };

    const headerFont: Partial<ExcelJS.Font> = {
        bold: true,
        color: { argb: 'FFFFFF' },
    };

    const border: Partial<ExcelJS.Borders> = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };

    const alignCenter: Partial<ExcelJS.Alignment> = {
        vertical: 'middle',
        horizontal: 'center',
    };

    const columnHeaders = [
        'Ngày',
        'Thứ',
        'T1',
        'T2',
        'T3',
        'T4',
        'Nlễ',
        '30',
        '39',
        'GC',
        '15',
        '20',
        'T.com',
        'VR',
        'PB',
        'KP',
        'PN',
        'ĐP',
        'Chờv',
        'Gđ',
        'TcCĐ',
        'Đtr',
        'Vs',
        'Mt-Cnho',
        'Ghi chú',
    ];

    let currentRow = 1;

    // Title and Logo
    // Add logo to the left of the company name (A1:B2)
    sheet.addImage(logoImageId, {
        tl: { col: 1, row: 0 }, // Top-left at A1
        ext: { width: 60, height: 60 }, // Same size as in PDF (30x30)
        editAs: 'absolute', // Ensures precise positioning
    });

    // Adjust company name to start at C1 to make space for the logo
    sheet.mergeCells(`C${currentRow}:I${currentRow}`);
    sheet.getCell(`C${currentRow}`).value = 'CÔNG TY TNHH CÔNG NGHIỆP DỆT HUGE - BAMBOO';
    sheet.getCell(`C${currentRow}`).font = { size: 12, bold: true };
    sheet.getRow(currentRow).height = 20;
    currentRow++;

    sheet.mergeCells(`C${currentRow}:I${currentRow}`);
    sheet.getCell(`C${currentRow}`).value = 'KCN MP , P Mỹ Phước , TX Bến Cát , T Bình Dương';
    sheet.getCell(`C${currentRow}`).font = { size: 10 };
    sheet.getRow(currentRow).height = 15;
    currentRow++;

    sheet.mergeCells(`H${currentRow}:L${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = 'Chi tiết chấm công tháng 考勤表';
    sheet.getCell(`H${currentRow}`).font = { size: 10 };
    sheet.getCell(`M${currentRow}`).value = month;
    sheet.getCell(`M${currentRow}`).font = { size: 10 };
    sheet.getRow(currentRow).height = 15;
    currentRow += 2;

    for (const employee of data) {
        // Info row
        sheet.getCell(`A${currentRow}`).value = employee.card_number;
        sheet.getCell(`D${currentRow}`).value = employee.fullname;
        sheet.getCell(`F${currentRow}`).value = employee.unit;
        sheet.getCell(`H${currentRow}`).value = employee.unit_name;
        sheet.getRow(currentRow).height = 15;
        currentRow++;

        // Header row
        const header = sheet.getRow(currentRow);
        columnHeaders.forEach((title, i) => {
            const cell = header.getCell(i + 1);
            cell.value = title;
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.border = border;
            cell.alignment = alignCenter;
        });
        header.height = 20;
        currentRow++;

        // Detail Rows
        for (const detail of employee.details) {
            const row = sheet.getRow(currentRow);
            const values = columnHeaders.map((key) => {
                if (key === 'Ghi chú') {
                    return detail.note ?? ''; // Use 'note' field for 'Ghi chú'
                }
                return (
                    (detail as any)[key] ??
                    (key === 'Ngày' ? detail.date : key === 'Thứ' ? detail.days : 0)
                );
            });
            values.forEach((v, i) => {
                const cell = row.getCell(i + 1);
                cell.value = v;
                cell.border = border;
                cell.alignment = alignCenter;
            });
            row.height = 15;
            currentRow++;
        }

        // Total row
        const totalRow = sheet.getRow(currentRow);
        const totalFill: ExcelJS.Fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' }, // Light gray background
        };
        totalRow.getCell(1).value = 'Tổng';
        totalRow.getCell(1).font = { bold: true }; // Use bold without white color
        totalRow.getCell(1).alignment = alignCenter;
        totalRow.getCell(1).fill = totalFill;
        for (let i = 2; i <= 24; i++) {
            const key = columnHeaders[i - 1] as keyof (typeof employee.details)[0];
            const total = employee.details.reduce(
                (sum, d) => sum + (typeof d[key] === 'number' ? (d[key] as number) : 0),
                0,
            );
            totalRow.getCell(i).value = total;
            totalRow.getCell(i).border = border;
            totalRow.getCell(i).alignment = alignCenter;
            totalRow.getCell(i).fill = totalFill; // Apply fill to all total cells
        }
        totalRow.height = 15;
        currentRow += 2;
    }

    // Column width
    sheet.columns.forEach((col, index) => {
        col.width = index === columnHeaders.length - 1 ? 15 : 10; // Make "Ghi chú" column wider
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `workday_report_${month}.xlsx`);
};
