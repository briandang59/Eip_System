import { Color, PDFDocument, PDFPage, PDFFont, PDFImage, rgb } from 'pdf-lib';
import { loadFont, loadFontBold, loadFontChinese, logos } from './basePdf';
import { DataReportType } from '../hooks/useDataReport';

const Print = (
    x: number,
    y: number,
    page: PDFPage,
    type: 'text' | 'image' | 'rectangle',
    text?: string,
    size?: number,
    font?: PDFFont,
    color?: Color,
    width?: number,
    height?: number,
    image?: PDFImage,
    fillColor?: Color,
) => {
    switch (type) {
        case 'text':
            return page.drawText(text || '', {
                x,
                y,
                size: size ?? 6,
                font: font!,
                color: color ?? rgb(0, 0, 0),
            });
        case 'image':
            if (!image) throw new Error('Image is required for type "image"');
            return page.drawImage(image, {
                x,
                y,
                width: width ?? 50,
                height: height ?? 50,
            });
        case 'rectangle':
            return page.drawRectangle({
                x,
                y,
                width: width ?? 50,
                height: height ?? 50,
                borderColor: rgb(0, 0, 0),
                borderWidth: 0.5,
                color: fillColor,
            });
    }
};

interface IPrintWorkdayReport {
    data: DataReportType[];
    monthAndYear: string;
}

export const PrintWorkdayReport = async ({
    data,
    monthAndYear,
}: IPrintWorkdayReport): Promise<string> => {
    try {
        const pageWidth = 595.28;
        const pageHeight = 900;
        const pdfDoc = await PDFDocument.create();

        const fontVN = await loadFont(pdfDoc);
        const fontCN = await loadFontChinese(pdfDoc);
        const fontBold = await loadFontBold(pdfDoc);

        const logoBytes = await fetch(logos.logo_report).then((res) => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(logoBytes);

        const columns: [number, number][] = [
            [7, 30],
            [37, 30],
            [67, 20],
            [87, 20],
            [107, 20],
            [127, 20],
            [147, 20],
            [167, 20],
            [187, 20],
            [207, 20],
            [227, 20],
            [247, 20],
            [267, 20],
            [287, 20],
            [307, 20],
            [327, 20],
            [347, 20],
            [367, 20],
            [387, 20],
            [407, 20],
            [427, 20],
            [447, 20],
            [467, 20],
            [487, 40],
            [527, 60],
        ];

        const columnFields: (keyof DataReportType['details'][0])[] = [
            'date',
            'days',
            'T1',
            'T2',
            'T3',
            'T4',
            'nle',
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
            'note',
        ];

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

        let page: PDFPage | null = null;

        for (let i = 0; i < data.length; i++) {
            const employee = data[i];
            const isFirstOnPage = i % 2 === 0;

            if (isFirstOnPage) {
                page = pdfDoc.addPage([pageWidth, pageHeight]);

                // Logo và thông tin công ty chỉ in ở trang đầu tiên
                if (i === 0) {
                    Print(
                        5,
                        pageHeight - 38,
                        page,
                        'image',
                        '',
                        0,
                        fontVN,
                        rgb(0, 0, 0),
                        30,
                        30,
                        logoImage,
                    );
                    Print(
                        40,
                        pageHeight - 20,
                        page,
                        'text',
                        'CÔNG TY TNHH CÔNG NGHIỆP DỆT HUGE - BAMBOO',
                        7,
                        fontVN,
                    );
                    Print(
                        40,
                        pageHeight - 30,
                        page,
                        'text',
                        'KCN MP , P Mỹ Phước , TX Bến Cát , T Bình Dương',
                        6,
                        fontVN,
                    );
                    Print(
                        300,
                        pageHeight - 30,
                        page,
                        'text',
                        'Chi tiết chấm công tháng ',
                        7,
                        fontVN,
                    );
                    Print(370, pageHeight - 30, page, 'text', '考勤表', 7, fontCN);
                    Print(400, pageHeight - 30, page, 'text', monthAndYear, 6, fontVN);
                }
            }

            const offsetY = isFirstOnPage ? 0 : 420;
            const startY = pageHeight - 75 - offsetY;

            Print(7, startY, page!, 'text', employee.card_number, 6, fontVN);
            Print(40, startY, page!, 'text', employee.fullname, 6, fontVN);
            Print(200, startY, page!, 'text', employee.unit, 6, fontVN);
            Print(280, startY, page!, 'text', employee.unit_name, 6, fontVN);
            Print(340, startY, page!, 'text', employee.employee_class, 6, fontVN);

            const headerY = startY - 15;
            columnHeaders.forEach((header, idx) => {
                const [x, w] = columns[idx];
                Print(
                    x,
                    headerY,
                    page!,
                    'rectangle',
                    '',
                    0,
                    undefined,
                    undefined,
                    w,
                    10,
                    undefined,
                    rgb(0, 102 / 255, 204 / 255),
                );
                Print(x + 2, headerY + 2, page!, 'text', header, 6, fontBold, rgb(1, 1, 1));
            });

            const rows = 31;
            const bodyStartY = headerY - 10;
            for (let row = 0; row < rows; row++) {
                const y = bodyStartY - row * 10;
                columns.forEach(([x, w], colIdx) => {
                    Print(x, y, page!, 'rectangle', '', 0, undefined, undefined, w, 10);
                    const detail = employee.details[row];
                    if (detail) {
                        const value = String(detail[columnFields[colIdx]] ?? '');
                        if (value) {
                            Print(x + 2, y + 2, page!, 'text', value, 5, fontVN);
                        }
                    }
                });
            }

            const totalY = bodyStartY - rows * 10;
            const total: Record<string, number> = {};
            columnFields.forEach((field) => {
                total[field as string] = employee.details.reduce((sum, d) => {
                    const val = d[field];
                    return sum + (typeof val === 'number' ? val : 0);
                }, 0);
            });

            columns.forEach(([x, w], colIdx) => {
                Print(
                    x,
                    totalY,
                    page!,
                    'rectangle',
                    '',
                    0,
                    undefined,
                    undefined,
                    w,
                    10,
                    undefined,
                    rgb(0.9, 0.9, 0.9),
                );
                if (colIdx === 0) {
                    Print(x + 2, totalY + 2, page!, 'text', 'Total', 5, fontVN);
                } else {
                    const val = total[columnFields[colIdx] as string];
                    if (val) {
                        Print(x + 2, totalY + 2, page!, 'text', String(val), 5, fontVN);
                    }
                }
            });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error creating PDF:', error);
        return '';
    }
};
