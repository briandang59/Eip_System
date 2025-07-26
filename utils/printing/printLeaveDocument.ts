import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {
    FontPickNote,
    getCompanyName,
    getLogoById,
    loadFont,
    loadFontChinese,
    logos,
} from './basePdf';
import { rgb } from 'pdf-lib';
import { StandardFonts } from 'pdf-lib';
import { BasicEmployee } from '@/types/printing/baseEmployee';
import dayjs from 'dayjs';

export const PrintLeaveDocument = async (
    data: BasicEmployee[],
    work_place_id: number,
): Promise<string> => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const pageWidth = 595.28;
    const pageHeight = 841.89;

    let font, font_b, font_chinese;
    try {
        font = await loadFont(pdfDoc);
        font_b = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        font_chinese = await loadFontChinese(pdfDoc);
    } catch (error) {
        console.error('Error loading fonts:', error);
        throw new Error('Failed to load required fonts');
    }

    const purpleColor = rgb(0.5, 0, 0.5); // màu tím cho tiêu đề
    const headerFontSize = 12;
    const size_word = 6;

    let logoImage;
    try {
        const logoBytes = await fetch(getLogoById(work_place_id)).then((res) => res.arrayBuffer());
        logoImage = await pdfDoc.embedPng(logoBytes);
    } catch (error) {
        console.error('Error loading logo:', error);
        // Create a simple text-based logo as fallback
        logoImage = null;
    }

    let avts;
    try {
        avts = await fetch(logos.default_image_user).then((res) => res.arrayBuffer());
    } catch (error) {
        console.error('Error loading default user image:', error);
        throw new Error('Failed to load default user image');
    }

    for (const employee of data) {
        // Tạo trang mới cho mỗi nhân viên
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        // ảnh nhân viên
        let employeeImage;
        if (employee.photo) {
            try {
                // If photo is a URL, fetch it
                const imgResponse = await fetch(employee.photo);
                const imgBuffer = await imgResponse.arrayBuffer();
                employeeImage = await pdfDoc.embedJpg(imgBuffer);
            } catch (error) {
                // If embedding fails, use default image
                employeeImage = await pdfDoc.embedJpg(avts);
            }
        } else {
            // Use default image if no photo
            employeeImage = await pdfDoc.embedJpg(avts);
        }

        // Vẽ logo
        page.drawImage(employeeImage, {
            x: 10,
            y: pageHeight - 65,
            width: 40,
            height: 50,
        });
        // Mã nhân viên
        page.drawText(employee.card_number, {
            x: 55,
            y: pageHeight - 40,
            size: 10,
            font: font_b,
        });

        // Vẽ logo
        if (logoImage) {
            const logoDims = logoImage.scale(0.15); // điều chỉnh kích thước logo
            page.drawImage(logoImage, {
                x: pageWidth - 125,
                y: pageHeight - 40,
                width: logoDims.width,
                height: logoDims.height + 5,
            });
        }

        // Tiêu đề công ty màu tím
        const textWidth = font.widthOfTextAtSize(
            getCompanyName(employee.work_place.id),
            headerFontSize,
        );

        page.drawText(getCompanyName(employee.work_place.id), {
            x: (pageWidth - textWidth) / 2 - 20,
            y: pageHeight - 30,
            size: headerFontSize,
            color: purpleColor,
            font: font_b,
        });

        page.drawText('ĐƠN XIN NGHI PHÉP', {
            x: (pageWidth - textWidth) / 2 + 10,
            y: pageHeight - 45,
            size: headerFontSize,
            color: purpleColor,
            font,
        });

        page.drawText('請假單', {
            x: (pageWidth - textWidth) / 2 + 50,
            y: pageHeight - 60,
            size: headerFontSize,
            color: purpleColor,
            font: font_chinese,
        });

        // Dòng đầu tiên của form
        const startY = pageHeight - 80;
        const lineSpacing = 25;
        const boxWidth = 200;
        const boxHeight = 20;

        // Đơn vị, chức vụ
        const unitTextVN = 'Đơn vị';
        const unitTextCN = '單位';
        page.drawText(unitTextVN, {
            // x: boxUnitX + (boxUnitWidth - unitTextVNWidth) +10 / 2,
            x: 40,
            y: startY,
            size: 8,
            font,
        });

        page.drawText(unitTextCN, {
            // x: boxUnitX + (boxUnitWidth - unitTextCNWidth) +10 / 2,
            x: 40,
            y: startY - 8,
            size: 8,
            font: font_chinese,
        });

        page.drawRectangle({
            x: 10,
            y: startY - 10,
            width: 90,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        const unitNameText = employee.organization_unit.name_vn?.toUpperCase() ?? '';
        const unitNameTextWidth = font.widthOfTextAtSize(unitNameText, 8);
        const boxUnitX = 100;
        const boxUnitWidth = 80;

        const size_unit = unitNameTextWidth > boxUnitWidth ? 6 : 8;
        const size_unit_cn = unitNameTextWidth > boxUnitWidth ? 10 : 0;

        page.drawText(unitNameText, {
            x: boxUnitX + (boxUnitWidth - unitNameTextWidth + size_unit_cn) / 2, // Căn giữa văn bản
            y: startY - 2,
            size: size_unit,
            font,
        });

        page.drawRectangle({
            x: boxUnitX,
            y: startY - 10,
            width: boxUnitWidth + 25,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Họ tên
        page.drawText('Họ tên', { x: 230, y: startY, size: 8, font });
        page.drawText('姓名', {
            x: 230,
            y: startY - 8,
            size: 8,
            font: font_chinese,
        });
        page.drawRectangle({
            x: 205,
            y: startY - 10,
            width: boxWidth,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        const fullNameText = employee.fullname.toUpperCase();
        const fullNameTextWidth = font.widthOfTextAtSize(fullNameText, 8);
        const boxX = 280;
        const boxWidthx = 200; // Giả sử boxWidth đã được định nghĩa trước đó là 200, nếu không bạn cần thay giá trị phù hợp

        page.drawText(fullNameText, {
            x: boxX + (boxWidthx - fullNameTextWidth - 10) / 4, // Căn giữa văn bản
            y: startY - 2,
            size: 8,
            font,
        });

        page.drawRectangle({
            x: boxX,
            y: startY - 10,
            width: boxWidthx,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Ngày nhận việc
        page.drawText('Ngày nhận việc', { x: 420, y: startY, size: 8, font });
        page.drawText('到職日', {
            x: 430,
            y: startY - 8,
            size: 8,
            font: font_chinese,
        });
        const date_join = employee.join_company_date2
            ? `${dayjs(employee.join_company_date2 ?? '').format('DD/MM/YYYY')}`
            : `${dayjs(employee.join_company_date ?? '').format('DD/MM/YYYY')}`;
        page.drawText(date_join, {
            x: 510,
            y: startY - 2,
            size: 8,
            font,
        });
        page.drawRectangle({
            x: 480,
            y: startY - 10,
            width: 105,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Dòng thứ hai
        const startY_2 = startY - boxHeight;

        //

        // Đơn vị, chức vụ
        page.drawText('A (Việc riêng)', { x: 30, y: startY_2, size: 8, font });
        page.drawText('事假', {
            x: 40,
            y: startY_2 - 8,
            size: 8,
            font: font_chinese,
        });
        page.drawRectangle({
            x: 10,
            y: startY_2 - 10,
            width: 90,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('B (Phép năm)', {
            x: 130,
            y: startY_2,
            size: 8,
            font,
        });
        page.drawText('年假', {
            x: 140,
            y: startY_2 - 8,
            size: 8,
            font: font_chinese,
        });
        page.drawRectangle({
            x: 100,
            y: startY_2 - 10,
            width: 105,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Họ tên
        page.drawText('C (P.Bệnh, Nghỉ sản)', {
            x: 208,
            y: startY_2,
            size: 8,
            font,
        });
        page.drawText('病假.產假', {
            x: 223,
            y: startY_2 - 8,
            size: 8,
            font: font_chinese,
        });
        page.drawRectangle({
            x: 205,
            y: startY_2 - 10,
            width: boxWidth,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('E (Kết hôn)', { x: 325, y: startY_2, size: 8, font });
        page.drawText('婚假', {
            x: 330,
            y: startY_2 - 8,
            size: 8,
            font: font_chinese,
        });
        page.drawRectangle({
            x: 280,
            y: startY_2 - 10,
            width: boxWidth,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Ngày nhận việc
        page.drawText('F (Tang)', { x: 430, y: startY_2, size: 8, font });
        page.drawText('喪假', {
            x: 435,
            y: startY_2 - 8,
            size: 8,
            font: font_chinese,
        });

        page.drawText('G (Tai nạn)', { x: 510, y: startY_2, size: 8, font });
        page.drawText('工傷', {
            x: 515,
            y: startY_2 - 8,
            size: 8,
            font: font_chinese,
        });
        page.drawRectangle({
            x: 480,
            y: startY_2 - 10,
            width: 105,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Chú thích
        const notes = [
            '1. CNV nghỉ phép do PCT trở lên và Chủ quản cao nhất bộ phận ký duyệt',
            ' 員工請假由副班長簽核再由單位課長以上或經理簽核',
            '2. PCT trở lên 1 ngày do ca trưởng, Chủ quản cao nhất ký, 2 ngày do Giám đốc xưởng/(Phó) xưởng trưởng ký',
            ' 副班長以上職務請假 1天由單位課長簽核, 2天以上需經單位經理/(副)廠長以上簽核',
            '3. Nghỉ phép năm ít nhất 1/2 ngày trở lên, không được nghỉ 1h, 2h, 3h...',
            '員工年假1次至少4小時(半天)或1天以上,不得請 1h ,2h ,3h...',
            '4. Nếu xin nghỉ quá 12 ngày (bao gồm tất cả các loại phép trừ phép chờ việc) phải làm phiếu "',
            'Thông báo nội bộ" có chữ ký CQ bộ phận,Giám đốc xưởng/(Phó) xưởng trưởng trình BPQL xét duyệt mới được nghỉ.',
            '若請超過12天以上(含所有的假別除外停工假)，要填內部通知單有單位主管和單位經理/(副)廠長以上簽核，後來請管理部批准',
            '5. Nghỉ phép phải tự làm thủ tục, không được làm dùm',
            '一律由當事人申請,不得代理請假',
        ];

        const row2Y = startY - lineSpacing;
        const notesY = row2Y - lineSpacing * 2;
        notes.forEach((note, index) => {
            page.drawText(note, {
                x: 20,
                y: notesY - index * 10 + 30,
                size: 8,
                font: FontPickNote(index, font, font_chinese),
            });
        });

        // Vẽ khung cho phần chú thích
        page.drawRectangle({
            x: 10,
            y: notesY - lineSpacing * notes.length + 20,
            width: pageWidth - 20.3,
            height: lineSpacing * notes.length + 10 + 15,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        const headerStartY = notesY - lineSpacing * 4 - 10 + 25;
        const height_x = 40;

        page.drawText('STT', {
            x: 15,
            y: headerStartY - 15,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 10,
            y: headerStartY - 30,
            width: 20,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('申請日', {
            x: 60,
            y: headerStartY - 10,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('Ngày xin', {
            x: 60,
            y: headerStartY - 20,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 30,
            y: headerStartY - 30,
            width: 85,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('請假日', {
            x: 145,
            y: headerStartY - 10,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('Ngày nghỉ', {
            x: 145,
            y: headerStartY - 20,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 115,
            y: headerStartY - 30,
            width: 85,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('假別', {
            x: 202,
            y: headerStartY - 10,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('Loại phép', {
            x: 202,
            y: headerStartY - 20,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 200,
            y: headerStartY - 30,
            width: 30,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('總天數', {
            x: 235,
            y: headerStartY - 10,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('Số ngày', {
            x: 235,
            y: headerStartY - 20,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 230,
            y: headerStartY - 30,
            width: 30,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('上班日', {
            x: 290,
            y: headerStartY - 10,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('Ngày đi làm', {
            x: 290,
            y: headerStartY - 20,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 260,
            y: headerStartY - 30,
            width: 85,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('人事', {
            x: 355,
            y: headerStartY - 20,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('Nhân sự', {
            x: 355,
            y: headerStartY - 25,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 345,
            y: headerStartY - 30,
            width: 40,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('申請員', {
            x: 390,
            y: headerStartY - 20,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('Người xin nghỉ', {
            x: 390,
            y: headerStartY - 25,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 385,
            y: headerStartY - 30,
            width: 45,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('班長', {
            x: 440,
            y: headerStartY - 20,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('Ca trưởng', {
            x: 440,
            y: headerStartY - 25,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 430,
            y: headerStartY - 30,
            width: 40,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('主管', {
            x: 475,
            y: headerStartY - 20,
            size: 6,
            font: font_chinese,
        });
        page.drawText('Chủ quản', {
            x: 475,
            y: headerStartY - 25,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 470,
            y: headerStartY - 30,
            width: 40,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('單位經理', {
            x: 515,
            y: headerStartY - 20,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('GĐ xưởng', {
            x: 515,
            y: headerStartY - 25,
            size: size_word,
            font,
        });
        page.drawRectangle({
            x: 510,
            y: headerStartY - 30,
            width: 40,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });
        // x 505/500
        page.drawText('管理部', {
            x: 555,
            y: headerStartY - 20,
            size: size_word,
            font: font_chinese,
        });
        page.drawText('BP Quản lý', {
            x: 555,
            y: headerStartY - 25,
            size: size_word,
            font,
        });

        //width 90
        page.drawRectangle({
            x: 550,
            y: headerStartY - 30,
            width: 35,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText('Ký tên 簽名', {
            x: 450,
            y: headerStartY,
            size: 8,
            font: font_chinese,
        });
        page.drawRectangle({
            x: 345,
            y: headerStartY - 10,
            width: 240,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        const x_widths = [10, 30, 115, 200, 230, 260, 345, 385, 430, 470, 510, 550];
        const rows = 28;
        const heightRows = headerStartY - 30; // Đảm bảo headerStartY được định nghĩa trước đó
        const rowHeight = 20; // Chiều cao mỗi hàng

        for (let i = 0; i < rows; i++) {
            x_widths.forEach((e, index) => {
                const nextX = index < x_widths.length - 1 ? x_widths[index + 1] : pageWidth - 45;
                const width = index === x_widths.length - 1 ? nextX - e - 10 : nextX - e;
                const yPosition = heightRows - i * rowHeight;

                const with_last = index === x_widths.length - 1 ? 44.5 : 0;

                page.drawRectangle({
                    x: e,
                    y: yPosition - rowHeight,
                    width: width + with_last,
                    height: rowHeight,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 1,
                });
            });
        }
        for (let i = 0; i < rows; i++) {
            page.drawText(`${i + 1}`, {
                x: 15,
                y: headerStartY - (i + 1) * rowHeight - 25,
                size: 8,
                font,
            });
        }

        const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
        const startY2 = startY + 30;

        // Đơn vị, chức vụ
        page2.drawText('Đơn vị', { x: 30, y: startY2, size: 8, font });
        page2.drawText('單位', {
            x: 30,
            y: startY2 - 8,
            size: 8,
            font: font_chinese,
        });
        page2.drawRectangle({
            x: 10,
            y: startY2 - 10,
            width: 90,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText(employee.organization_unit.name_vn?.toUpperCase() ?? '', {
            x: 130,
            y: startY2,
            size: 8,
            font,
        });

        page2.drawRectangle({
            x: 100,
            y: startY2 - 10,
            width: 105,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Họ tên
        page2.drawText('Họ tên', { x: 230, y: startY2, size: 8, font });
        page2.drawText('姓名', {
            x: 230,
            y: startY2 - 8,
            size: 8,
            font: font_chinese,
        });
        page2.drawRectangle({
            x: 205,
            y: startY2 - 10,
            width: boxWidth,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText(employee.fullname.toUpperCase(), {
            x: 300,
            y: startY2,
            size: 8,
            font,
        });
        page2.drawRectangle({
            x: 285,
            y: startY2 - 10,
            width: boxWidth - 5,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Ngày nhận việc
        page2.drawText('Ngày nhận việc', { x: 420, y: startY2, size: 8, font });
        page2.drawText('到職日', {
            x: 420,
            y: startY2 - 8,
            size: 8,
            font: font_chinese,
        });

        page2.drawText(date_join, {
            x: 495,
            y: startY2,
            size: 8,
            font,
        });

        page2.drawRectangle({
            x: 480,
            y: startY2 - 10,
            width: 105,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        const headerStartY2 = notesY + 85;

        page2.drawText('STT', {
            x: 15,
            y: headerStartY2 - 20,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 10,
            y: headerStartY2 - 30,
            width: 20,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('申請日', {
            x: 50,
            y: headerStartY2 - 10,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('Ngày xin', {
            x: 50,
            y: headerStartY2 - 20,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 30,
            y: headerStartY2 - 30,
            width: 85,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('請假日', {
            x: 120,
            y: headerStartY2 - 10,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('Ngày nghỉ', {
            x: 120,
            y: headerStartY2 - 20,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 115,
            y: headerStartY2 - 30,
            width: 85,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('假別', {
            x: 202,
            y: headerStartY2 - 10,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('Loại phép', {
            x: 202,
            y: headerStartY2 - 20,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 200,
            y: headerStartY2 - 30,
            width: 30,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('總天數', {
            x: 235,
            y: headerStartY2 - 10,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('Số ngày', {
            x: 235,
            y: headerStartY2 - 20,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 230,
            y: headerStartY2 - 30,
            width: 30,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('上班日', {
            x: 265,
            y: headerStartY2 - 10,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('Ngày đi làm', {
            x: 265,
            y: headerStartY2 - 20,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 260,
            y: headerStartY2 - 30,
            width: 85,
            height: height_x,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('人事', {
            x: 355,
            y: headerStartY2 - 20,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('Nhân sự', {
            x: 355,
            y: headerStartY2 - 25,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 345,
            y: headerStartY2 - 30,
            width: 40,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('申請員', {
            x: 390,
            y: headerStartY2 - 20,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('Người xin nghỉ', {
            x: 390,
            y: headerStartY2 - 25,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 385,
            y: headerStartY2 - 30,
            width: 45,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('班長', {
            x: 440,
            y: headerStartY2 - 20,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('Ca trưởng', {
            x: 440,
            y: headerStartY2 - 25,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 430,
            y: headerStartY2 - 30,
            width: 40,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('主管', {
            x: 475,
            y: headerStartY2 - 20,
            size: 6,
            font: font_chinese,
        });
        page2.drawText('Chủ quản', {
            x: 475,
            y: headerStartY2 - 25,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 470,
            y: headerStartY2 - 30,
            width: 40,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('單位經理', {
            x: 515,
            y: headerStartY2 - 20,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('GĐ xưởng', {
            x: 515,
            y: headerStartY2 - 25,
            size: size_word,
            font,
        });
        page2.drawRectangle({
            x: 510,
            y: headerStartY2 - 30,
            width: 40,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('管理部', {
            x: 555,
            y: headerStartY2 - 20,
            size: size_word,
            font: font_chinese,
        });
        page2.drawText('BP Quản lý', {
            x: 555,
            y: headerStartY2 - 25,
            size: size_word,
            font,
        });

        page2.drawRectangle({
            x: 550,
            y: headerStartY2 - 30,
            width: 35,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page2.drawText('Ký tên 簽名', {
            x: 450,
            y: headerStartY2,
            size: 8,
            font: font_chinese,
        });
        page2.drawRectangle({
            x: 345,
            y: headerStartY2 - 10,
            width: 240,
            height: height_x - 20,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        const x_widths2 = [10, 30, 115, 200, 230, 260, 345, 385, 430, 470, 510, 550];
        const rows2 = 35;
        const heightRows2 = headerStartY2 - 30; // Đảm bảo headerStartY2 được định nghĩa trước đó
        const rowHeight2 = 20; // Chiều cao mỗi hàng

        for (let i = 0; i < rows2; i++) {
            x_widths2.forEach((e, index) => {
                const nextX = index < x_widths.length - 1 ? x_widths2[index + 1] : pageWidth - 45;
                const width = index === x_widths.length - 1 ? nextX - e - 10 : nextX - e;
                const yPosition = heightRows2 - i * rowHeight2;
                const with_last = index === x_widths2.length - 1 ? 44.5 : 0;

                page2.drawRectangle({
                    x: e,
                    y: yPosition - rowHeight,
                    width: width + with_last,
                    height: rowHeight,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 1,
                });
            });
        }
        for (let i = 0; i < rows2; i++) {
            page2.drawText(`${i + 1}`, {
                x: 15,
                y: headerStartY2 - (i + 1) * rowHeight2 - 25,
                size: 8,
                font,
            });
        }
    }

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    return pdfDataUri;
};
