import { PDFDocument, rgb } from 'pdf-lib';
import { COLOR_BLUE, loadFont, loadFontBold } from './basePdf';
import dayjs from 'dayjs';
import { ContractType } from '@/types/printing/contractType';
import { IEmployee } from '@/types/printing/IEmployee';
import { useEmployeeSalaryAllowances } from '@/apis/useSwr/employeeSalaryAllowance';
import { useFindAddress } from '../hooks/useFindAddress';
import { SalaryAllowance } from '@/types/response/salaryAllowance';

export const PrintContractOffice = async (
    data: IEmployee[],
    day: number,
    month: number,
    year: number,
    type: ContractType,
    style: number,
    number_contract: string,
    base_salary: SalaryAllowance[],
): Promise<string> => {
    try {
        const pdfDoc = await PDFDocument.create();
        const pageWidth = 595.28;
        const pageHeight = 841.89;

        const font = await loadFont(pdfDoc);
        const font_bold = await loadFontBold(pdfDoc);
        const font_size_title = 10;
        const font_size_topic = 12;

        for (const employee of data) {
            const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
            page1.setFont(font);

            const address = useFindAddress(employee.vn_address);

            const salary = base_salary?.[0]?.base_salary?.salary ?? 0;
            const up_percent = salary * 0.05;
            const final_salary = salary + up_percent;

            // Unit
            const name_unit = employee.work_place_id === 5 ? 'LONG TRIUMPH' : 'HUGE BAMBOO';
            const name_factory =
                employee.work_place_id === 5
                    ? 'Công ty TNHH Long Triumph'
                    : 'Công ty TNHH CN Dệt Huge - Bamboo';
            const address_factory = employee?.work_place?.address ?? '';

            // KPI
            const kpi_x1x2 = style === 1 ? '530,000' : '2,000,000';
            const kpt_lt = '500,000';
            const sum_kpi = employee.work_place_id === 5 ? kpt_lt : kpi_x1x2;

            // bossinformation
            const name_boss = employee.work_place_id === 5 ? 'TSAI MENG LIN' : 'YANG HAI SHAN';
            const position_boss =
                employee.work_place_id === 5 ? 'Tổng giám đốc' : 'Phó tổng giám đốc';
            const passport_boss = employee.work_place_id === 5 ? '353443090' : '353447966';
            const passport_date = employee.work_place_id === 5 ? '11/20/2020' : '11/16/2020';
            const phone_boss = employee.work_place_id === 5 ? '' : ' 0274 - 3566566';

            // phần bên trái
            page1.drawText('Tên đơn vị :', {
                x: 20,
                y: pageHeight - 20,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText(name_unit, {
                x: 80,
                y: pageHeight - 20,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Số :', {
                x: 20,
                y: pageHeight - 40,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText(`HĐ/${employee.card_number}  - ${number_contract}`, {
                x: 60,
                y: pageHeight - 40,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText(`${employee.card_number}  -   ${employee.unit?.name_vn}`, {
                x: 30,
                y: pageHeight - 70,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            // phần trên bên phải

            page1.drawText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', {
                x: 380,
                y: pageHeight - 20,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText(' Độc lập - Tự do - Hạnh phúc', {
                x: 430,
                y: pageHeight - 30,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText(
                `                                  ${day}                ${month}               ${year}`,
                {
                    x: 390,
                    y: pageHeight - 60,
                    size: font_size_title,
                    font: font_bold,
                },
            );

            page1.drawText(`Bình Dương , ngày`, {
                x: 390,
                y: pageHeight - 60,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText(`tháng`, {
                x: 490,
                y: pageHeight - 60,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText(`năm`, {
                x: 535,
                y: pageHeight - 60,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            // tiêu đề giữa
            page1.drawText('HỢP ĐỒNG LAO ĐỘNG', {
                x: 220,
                y: pageHeight - 80,
                size: font_size_topic,
                font: font_bold,
            });

            page1.drawText('- Căn cứ vào Bộ Luật Lao Động số 45/2019/QH14 ngày 20/11/2019', {
                x: 20,
                y: pageHeight - 110,
                size: font_size_title,
            });

            page1.drawText(
                '- Căn cứ vào Nghị Định 145/2020/NĐ-CP ngày 14/12/2020 của Chính Phủ hướng dẫn chi tiết một số nội dung của Bộ Luật Lao Động.',
                {
                    x: 20,
                    y: pageHeight - 125,
                    size: font_size_title,
                    font,
                },
            );

            page1.drawText('Chúng tôi, một bên là Ông/ Bà :', {
                x: 20,
                y: pageHeight - 140,
                size: font_size_title,
                font,
            });

            page1.drawText(name_boss, {
                x: 150,
                y: pageHeight - 140,
                size: font_size_title + 2,
                font: font_bold,
            });

            page1.drawText('Quốc tịch :', {
                x: 400,
                y: pageHeight - 140,
                size: font_size_title,
                font,
            });

            page1.drawText('Đài Loan', {
                x: 450,
                y: pageHeight - 140,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Chức vụ :', {
                x: 20,
                y: pageHeight - 160,
                size: font_size_title,
                font,
            });

            page1.drawText(position_boss, {
                x: 60,
                y: pageHeight - 160,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Số hộ chiếu:', {
                x: 150,
                y: pageHeight - 160,
                size: font_size_title,
                font,
            });

            page1.drawText(passport_boss, {
                x: 205,
                y: pageHeight - 160,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Ngày cấp:', {
                x: 260,
                y: pageHeight - 160,
                size: font_size_title,
                font,
            });

            page1.drawText(passport_date, {
                x: 310,
                y: pageHeight - 160,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Nơi cấp:', {
                x: 400,
                y: pageHeight - 160,
                size: font_size_title,
                font,
            });

            page1.drawText('Đài Loan', {
                x: 450,
                y: pageHeight - 160,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Đại diện cho :', {
                x: 20,
                y: pageHeight - 180,
                size: font_size_title,
                font,
            });

            page1.drawText(name_factory, {
                x: 150,
                y: pageHeight - 180,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Điện thoại:', {
                x: 400,
                y: pageHeight - 180,
                size: font_size_title,
                font,
            });

            page1.drawText(phone_boss, {
                x: 450,
                y: pageHeight - 170,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Địa chỉ :', {
                x: 20,
                y: pageHeight - 200,
                size: font_size_title,
                font,
            });

            page1.drawText(address_factory, {
                x: 70,
                y: pageHeight - 200,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Và một bên là Ông/Bà :', {
                x: 20,
                y: pageHeight - 220,
                size: font_size_title,
                font,
            });

            page1.drawText(employee.fullname, {
                x: 150,
                y: pageHeight - 220,
                size: font_size_title + 2,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText('Quốc tịch :', {
                x: 400,
                y: pageHeight - 220,
                size: font_size_title,
                font,
            });

            page1.drawText(employee.nation?.name_vn ?? '', {
                x: 450,
                y: pageHeight - 220,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText('Sinh ngày :', {
                x: 20,
                y: pageHeight - 240,
                size: font_size_title,
                font,
            });

            page1.drawText(dayjs(employee.birthday ?? '').format('DD/MM/YYYY') ?? '', {
                x: 150,
                y: pageHeight - 240,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText('Tại :', {
                x: 400,
                y: pageHeight - 240,
                size: font_size_title,
                font,
            });

            page1.drawText(employee.province ?? '', {
                x: 430,
                y: pageHeight - 240,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText('Nghề nghiệp:', {
                x: 20,
                y: pageHeight - 260,
                size: font_size_title,
                font,
            });

            page1.drawText('Công nhân viên', {
                x: 150,
                y: pageHeight - 260,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('Địa chỉ thường trú :', {
                x: 20,
                y: pageHeight - 280,
                size: font_size_title,
                font,
            });

            page1.drawText(address ?? '', {
                x: 150,
                y: pageHeight - 280,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText('Số CCCD :', {
                x: 20,
                y: pageHeight - 300,
                size: font_size_title,
                font,
            });

            page1.drawText(employee.id_card_number ?? '', {
                x: 80,
                y: pageHeight - 300,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText('Ngày cấp:', {
                x: 200,
                y: pageHeight - 300,
                size: font_size_title,
                font,
            });

            page1.drawText(dayjs(employee.id_card_issue_date ?? '').format('DD/MM/YYYY') ?? '', {
                x: 250,
                y: pageHeight - 300,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText('Nơi cấp:', {
                x: 400,
                y: pageHeight - 300,
                size: font_size_title,
                font,
            });

            page1.drawText(employee.id_card_issue_by ?? '', {
                x: 450,
                y: pageHeight - 300,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText(
                'Thoả thuận ký kết hợp đồng lao động và cam kết làm đúng những điều khoản sau đây :',
                {
                    x: 150,
                    y: pageHeight - 350,
                    size: font_size_title,
                    font,
                },
            );

            // Điều 1
            page1.drawText('Điều 1: Điều khoản và công việc trong Hợp đồng', {
                x: 30,
                y: pageHeight - 370,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('- Loại hợp đồng:', {
                x: 20,
                y: pageHeight - 390,
                size: font_size_title,
                font,
            });

            page1.drawText(type?.name_vn ?? '', {
                x: 150,
                y: pageHeight - 390,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('- Từ ngày  :', {
                x: 20,
                y: pageHeight - 410,
                size: font_size_title,
                font,
            });

            page1.drawText(
                type.id === 3
                    ? `${day} tháng ${month} năm ${year}`
                    : `${day} tháng ${month} năm ${year}    Đến ngày ${day - 1 === 0 ? 30 : day - 1} tháng ${month} năm ${year + (type.expire_year ?? 0)}`,
                {
                    x: 120,
                    y: pageHeight - 410,
                    size: font_size_title,
                    font: font_bold,
                },
            );

            page1.drawText('- Địa điểm làm việc :', {
                x: 20,
                y: pageHeight - 430,
                size: font_size_title,
                font,
            });

            page1.drawText('Bộ phận:', {
                x: 200,
                y: pageHeight - 430,
                size: font_size_title,
                font,
            });

            page1.drawText(`${employee.unit?.name_vn?.toUpperCase()}`, {
                x: 250,
                y: pageHeight - 430,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText(`Tại ${name_factory}`, {
                x: 350,
                y: pageHeight - 430,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText(address_factory, {
                x: 70,
                y: pageHeight - 450,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('- Chức danh chuyên môn :', {
                x: 20,
                y: pageHeight - 470,
                size: font_size_title,
                font,
            });

            page1.drawText(`${employee.unit?.name_vn?.toUpperCase()}`, {
                x: 150,
                y: pageHeight - 470,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page1.drawText('Chức vụ (nếu có) :', {
                x: 350,
                y: pageHeight - 470,
                size: font_size_title,
                font,
            });

            page1.drawText('- Công việc phải làm  :', {
                x: 20,
                y: pageHeight - 490,
                size: font_size_title,
                font,
            });

            page1.drawText(`${employee.work_description ?? ''}`, {
                x: 150,
                y: pageHeight - 490,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText('- Nhiệm vụ công việc như sau:', {
                x: 20,
                y: pageHeight - 510,
                size: font_size_title,
                font,
            });

            page1.drawText(
                '+ Phối hợp cùng với các bộ phận, phòng ban khác trong công ty để phát huy tối đa hiệu quả công việc.',
                {
                    x: 20,
                    y: pageHeight - 525,
                    size: font_size_title,
                    font,
                },
            );

            page1.drawText(
                '+ Hoàn thành những công việc khác tùy thuộc theo yêu cầu kinh doanh của Công ty và theo quyết định của Ban Giám đốc',
                {
                    x: 20,
                    y: pageHeight - 540,
                    size: font_size_title,
                    font,
                },
            );

            // điều 2

            page1.drawText(
                'Điều 2 :  Chế độ làm việc, nghỉ ngơi, bảo hộ lao động, Chế độ Bảo hiểm',
                {
                    x: 30,
                    y: pageHeight - 555,
                    size: font_size_title,
                    font: font_bold,
                },
            );

            page1.drawText('1. Thời gian làm việc :', {
                x: 20,
                y: pageHeight - 570,
                size: font_size_title,
                font: font_bold,
            });

            page1.drawText(
                style === 1
                    ? ''
                    : '8 giờ/ngày,48 giờ/tuần. Từ thứ 2 đến thứ 7 hàng tuần. Nghỉ hàng tuần : 1 ngày chủ nhật từ 08h00 đến 08h00 hôm sau',
                {
                    x: 120,
                    y: pageHeight - 570,
                    size: font_size_title,
                    font,
                },
            );

            page1.drawRectangle({
                x: 20,
                y: pageHeight - 690,
                width: 570,
                height: 110,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            // khung tiêu đề
            page1.drawRectangle({
                x: 20,
                y: pageHeight - 605,
                width: 350,
                height: 25,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            // khung ca 1
            page1.drawRectangle({
                x: 20,
                y: pageHeight - 645,
                width: 350,
                height: 40,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            // khung ca 1 nhỏ
            page1.drawRectangle({
                x: 20,
                y: pageHeight - 645,
                width: 80,
                height: 40,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            // khung ca 1 khung giờ 1
            page1.drawRectangle({
                x: 100,
                y: pageHeight - 645,
                width: 270,
                height: 20,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            // khung ca 2
            page1.drawRectangle({
                x: 20,
                y: pageHeight - 690,
                width: 350,
                height: 45,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            // khung ca 2 nhỏ
            page1.drawRectangle({
                x: 20,
                y: pageHeight - 690,
                width: 80,
                height: 45,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            // khung ca 2 khung giờ 1
            page1.drawRectangle({
                x: 100,
                y: pageHeight - 690,
                width: 270,
                height: 25,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            // khung nghỉ ngắn 1
            page1.drawRectangle({
                x: 370,
                y: pageHeight - 645,
                width: 220,
                height: 65,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
            });

            page1.drawText('Ca hành chính: Từ 08h00 đến 17h30 (nghỉ ngơi từ 12h00 đến 13h30)', {
                x: 30,
                y: pageHeight - 600,
                size: font_size_title,
                font,
            });

            page1.drawText('Ca 1:', {
                x: 50,
                y: pageHeight - 630,
                size: font_size_title,
                font,
            });

            page1.drawText('Từ 08h00 đến 16h00 (nghỉ ngơi từ 12h00 đến 12h30)', {
                x: 120,
                y: pageHeight - 620,
                size: font_size_title,
                font,
            });

            page1.drawText('Thời giờ nghỉ ngơi từ 18h00 đến 18h30 (nếu có tăng ca)', {
                x: 120,
                y: pageHeight - 640,
                size: font_size_title,
                font,
            });

            page1.drawText('Ca 2:', {
                x: 50,
                y: pageHeight - 670,
                size: font_size_title,
                font,
            });

            page1.drawText('Từ 20h00 đến 04h00 (nghỉ ngơi từ 00h00 đến 00h45)', {
                x: 120,
                y: pageHeight - 660,
                size: font_size_title,
                font,
            });

            page1.drawText('Thời giờ nghỉ ngơi từ 06h00 đến 06h30 (nếu có tăng ca)', {
                x: 120,
                y: pageHeight - 680,
                size: font_size_title,
                font,
            });

            page1.drawText('Thời gian nghỉ ngắn', {
                x: 380,
                y: pageHeight - 600,
                size: font_size_title,
                font,
            });
            page1.drawText('- Lần 1 từ 10h00 đến 10h05', {
                x: 380,
                y: pageHeight - 615,
                size: font_size_title,
                font,
            });
            page1.drawText('- Lần 2 từ 15h00 đến 15h05', {
                x: 380,
                y: pageHeight - 630,
                size: font_size_title,
                font,
            });

            page1.drawText('Thời gian nghỉ ngắn', {
                x: 380,
                y: pageHeight - 660,
                size: font_size_title,
                font,
            });
            page1.drawText('- Lần 1 từ 22h00 đến 22h05', {
                x: 380,
                y: pageHeight - 670,
                size: font_size_title,
                font,
            });
            page1.drawText('- Lần 2 từ 02h45 đến 02h50', {
                x: 380,
                y: pageHeight - 685,
                size: font_size_title,
                font,
            });

            page1.drawText(
                '- Do tính chất công việc, nhu cầu kinh doanh hay nhu cầu của tổ chức/bộ phận, Công ty có thể cho áp dụng thời gian làm việc linh hoạt.',
                {
                    x: 20,
                    y: pageHeight - 710,
                    size: font_size_title,
                    font,
                },
            );

            page1.drawText(
                'Những nhân viên được áp dụng thời gian làm việc linh hoạt có thể không tuân thủ lịch làm việc cố định bình thường mà làm theo ca kíp,',
                {
                    x: 20,
                    y: pageHeight - 725,
                    size: font_size_title,
                    font,
                },
            );

            page1.drawText('nhưng vẫn phải đảm bảo đủ số giờ làm việc theo quy định.', {
                x: 20,
                y: pageHeight - 740,
                size: font_size_title,
                font,
            });

            page1.drawText(
                'Làm thêm giờ dựa trên tinh thần tự nguyện, Nhân viên làm thêm giờ phải tự mình ký tên vào “Phiếu tự nguyện tăng ca” ',
                {
                    x: 20,
                    y: pageHeight - 755,
                    size: font_size_title,
                    font,
                },
            );

            page1.drawText('nếu không ký tên thì không được làm thêm giờ. ', {
                x: 20,
                y: pageHeight - 770,
                size: font_size_title,
                font: font,
            });

            page1.drawText(
                'Tăng ca vào ngày thường tính 150%. Tăng ca vào ngày nghỉ hàng tuần tính 200%.',
                {
                    x: 20,
                    y: pageHeight - 785,
                    size: font_size_title,
                    font,
                },
            );

            page1.drawText(
                'Tăng ca vào ngày nghỉ lễ, tết, ngày nghỉ có hưởng lương tính 300%. (Chưa kể tiền lương ngày lễ, tết, ngày nghỉ có hưởng lương).',
                {
                    x: 20,
                    y: pageHeight - 800,
                    size: font_size_title,
                    font,
                },
            );

            const page2 = pdfDoc.addPage([pageWidth, pageHeight]);

            page2.drawText('2. Chế độ nghỉ ngơi (phép năm, lễ tết … ) :', {
                x: 20,
                y: pageHeight - 20,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText(
                'Phép năm: 14 ngày phép/năm. Cứ 5 năm làm việc được nghỉ phép thêm 01 ngày.',
                {
                    x: 250,
                    y: pageHeight - 20,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(
                'Làm việc chưa đủ 12 tháng thì số ngày nghỉ phép năm sẽ được tính theo tỷ lệ tương ứng số tháng làm việc thực tế.',
                {
                    x: 20,
                    y: pageHeight - 35,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('* Tết dương lịch: 01 ngày ( Ngày 01/01 dương lịch)', {
                x: 20,
                y: pageHeight - 50,
                size: font_size_title,
                font,
            });

            page2.drawText('* Tết âm lịch: 05 ngày ', {
                x: 20,
                y: pageHeight - 65,
                size: font_size_title,
                font,
            });

            page2.drawText('* Giỗ tổ Hùng Vương: 01 ngày (Ngày 10/03 âm lịch)', {
                x: 20,
                y: pageHeight - 80,
                size: font_size_title,
                font,
            });

            page2.drawText('* Ngày Chiến thắng: 01 ngày (Ngày 30/04 dương lịch)', {
                x: 20,
                y: pageHeight - 95,
                size: font_size_title,
                font,
            });

            page2.drawText('* Ngày quốc tế lao động: 01 ngày (Ngày 01/05 dương lịch)', {
                x: 20,
                y: pageHeight - 110,
                size: font_size_title,
                font,
            });

            page2.drawText(
                '* Ngày Quốc khánh: 02 ngày (Ngày 02/09 dương lịch và 01 ngày liền trước hoặc sau ngày 02/09 tùy điều kiện thực tế)',
                {
                    x: 20,
                    y: pageHeight - 125,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('Nghỉ việc riêng được hưởng nguyên lương trong những trường hợp sau:', {
                x: 20,
                y: pageHeight - 140,
                size: font_size_title,
                font,
            });

            page2.drawText('* Bản thân kết hôn: nghỉ 03 ngày', {
                x: 30,
                y: pageHeight - 155,
                size: font_size_title,
                font,
            });

            page2.drawText('* Con đẻ, con nuôi kết hôn: nghỉ 01 ngày', {
                x: 30,
                y: pageHeight - 170,
                size: font_size_title,
                font,
            });

            page2.drawText(
                '* Cha đẻ, mẹ đẻ, cha nuôi, mẹ nuôi, cha đẻ mẹ đẻ cha nuôi mẹ nuôi của vợ hoặc chồng, vợ hoặc chồng, con đẻ, con nuôi chết: nghỉ 03 ngày',
                {
                    x: 30,
                    y: pageHeight - 185,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(
                'Nghỉ việc riêng không hưởng lương tối đa không quá 12 ngày/tháng, 30 ngày trong một năm.',
                {
                    x: 20,
                    y: pageHeight - 200,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('3. Được trang bị bảo hộ lao động gồm(nếu có) : ', {
                x: 20,
                y: pageHeight - 215,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText(
                'Khẩu trang, găng tay nhựa, găng tay len, găng tay cách nhiệt, găng tay cách điện, ủng,',
                {
                    x: 230,
                    y: pageHeight - 215,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(
                'mặt nạ phòng độc, nút chống ồn, mũ trùm tóc, mũ bảo hộ, kính bảo hộ, áo phản quang, tạp dề chống hóa chất, máy rửa mắt, mặt nạ hàn,',
                {
                    x: 20,
                    y: pageHeight - 230,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('kính hàn, giày cách điện, giày bảo hộ chống va đập, dây đai an toàn.', {
                x: 20,
                y: pageHeight - 245,
                size: font_size_title,
                font,
            });

            page2.drawText(
                'Dựa vào "Bảng bảo hộ lao động các bộ phận" số ban hành: BHLĐ-01 ngày 01/01/2019 để cấp phát tùy theo tính chất công việc của  bộ phận',
                {
                    x: 20,
                    y: pageHeight - 260,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(
                'Được cấp phát những dụng cụ làm việc gồm :     Đồng phục (Áo 3 cái/năm)',
                {
                    x: 20,
                    y: pageHeight - 275,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(
                'Dụng cụ được cấp phát miễn phí theo công việc yêu cầu, cố ý làm hư hỏng phải chịu trách nhiệm và theo giá trị thị trường bồi thường cho',
                {
                    x: 20,
                    y: pageHeight - 290,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('công ty.', {
                x: 20,
                y: pageHeight - 305,
                size: font_size_title,
                font,
            });

            page2.drawText('4. Bảo hiểm xã hội và bảo hiểm y tế:', {
                x: 20,
                y: pageHeight - 320,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText(
                'Mức lương tham gia BH bao gồm: LCB+C.Vụ(nếu có)+ATVSV(nếu có)+PCCC(nếu có):',
                {
                    x: 20,
                    y: pageHeight - 335,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(`${final_salary.toLocaleString('vi-VN')}  ( VNĐ )`, {
                x: 400,
                y: pageHeight - 335,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page2.drawText(
                '- BHXH: Công ty đóng 17.5%, cá nhân đóng 8%. BHYT: Công ty đóng 3%, cá nhân đóng 1.5%',
                {
                    x: 150,
                    y: pageHeight - 350,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('- BHTN: Công ty đóng 1%, cá nhân đóng 1%', {
                x: 150,
                y: pageHeight - 365,
                size: font_size_title,
                font,
            });

            page2.drawText(
                '- Công đoàn: công ty đóng 2%/ tổng quỹ lương tham gia BH, cá nhân đóng 50.000 đồng.',
                {
                    x: 150,
                    y: pageHeight - 380,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('Điều 3 : Nghĩa vụ và quyền lợi của người lao động', {
                x: 30,
                y: pageHeight - 395,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText('1. Nghĩa vụ:', {
                x: 20,
                y: pageHeight - 410,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText(
                '- Thực hiện đúng cam kết trong HĐLĐ và các thỏa thuận bằng văn bản khác với Công ty.',
                {
                    x: 20,
                    y: pageHeight - 425,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(
                ' - Nắm rõ và chấp hành nghiêm túc kỷ luật lao động, an toàn lao động, vệ sinh lao động, PCCC, văn hóa công ty, nội quy lao động và các ',
                {
                    x: 20,
                    y: pageHeight - 440,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('chủ trương, chính sách của Công ty.', {
                x: 20,
                y: pageHeight - 455,
                size: font_size_title,
                font,
            });

            page2.drawText('- Bồi thường vi phạm và vật chất:', {
                x: 20,
                y: pageHeight - 470,
                size: font_size_title,
                font,
            });

            page2.drawText('Theo luật lao động hiện hành và nội quy công ty', {
                x: 250,
                y: pageHeight - 470,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText('- Chế độ đào tạo: Theo quy định của Công ty và yêu cầu công việc.', {
                x: 20,
                y: pageHeight - 485,
                size: font_size_title,
                font,
            });

            page2.drawText('2. Quyền lợi:', {
                x: 20,
                y: pageHeight - 500,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText('- Phương tiện đi lại làm việc:', {
                x: 20,
                y: pageHeight - 515,
                size: font_size_title,
                font,
            });

            page2.drawText('Tự túc', {
                x: 150,
                y: pageHeight - 515,
                size: font_size_title + 1,
                font: font_bold,
            });

            page2.drawText('- Mức lương chính hoặc tiền công:', {
                x: 20,
                y: pageHeight - 530,
                size: font_size_title,
                font,
            });

            page2.drawText(`${final_salary.toLocaleString('vi-VN')}  ( VNĐ )`, {
                x: 200,
                y: pageHeight - 530,
                size: font_size_topic,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page2.drawText('- Hình thức trả lương : ', {
                x: 20,
                y: pageHeight - 545,
                size: font_size_title,
                font,
            });

            page2.drawText('1 tháng 1 lần', {
                x: 150,
                y: pageHeight - 545,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText('- Phụ cấp gồm:', {
                x: 20,
                y: pageHeight - 560,
                size: font_size_title,
                font,
            });

            page2.drawText('Phụ cấp chức vụ ( nếu có).    -       0   VNĐ', {
                x: 150,
                y: pageHeight - 560,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText(
                'Phụ cấp ATVSV: (nếu có)    -       0    VNĐ   Phụ cấp PCCC: (nếu có)           -       0    VNĐ',
                {
                    x: 150,
                    y: pageHeight - 575,
                    size: font_size_title,
                    font: font_bold,
                },
            );

            page2.drawText(
                'Trợ cấp nuôi con nhỏ từ 01 đến 06 tuổi: 30.000 vnđ/người/tháng (nếu có )',
                {
                    x: 150,
                    y: pageHeight - 590,
                    size: font_size_title,
                    font: font_bold,
                    color: COLOR_BLUE,
                },
            );

            page2.drawText('Trợ cấp tiền cơm làm ca đêm (nếu có)', {
                x: 150,
                y: pageHeight - 605,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page2.drawText('Trợ cấp điện thoại, xăng xe, nhà trọ, hỗ trợ đặc biệt (nếu có)', {
                x: 150,
                y: pageHeight - 620,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page2.drawText('- Tiền thưởng: Cách tính theo quy chế thưởng của công ty quy định', {
                x: 20,
                y: pageHeight - 635,
                size: font_size_title,
                font,
            });

            page2.drawText(`+ KPI (nếu có) :                          VNĐ`, {
                x: 100,
                y: pageHeight - 650,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText(sum_kpi, {
                x: 180,
                y: pageHeight - 650,
                size: font_size_title,
                font: font_bold,
                color: COLOR_BLUE,
            });

            page2.drawText('(Cách tính theo quy chế thưởng của công ty quy định )', {
                x: 100,
                y: pageHeight - 665,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText('+ Thưởng hiệu quả sản xuất từng tháng: (nếu có)', {
                x: 110,
                y: pageHeight - 680,
                size: font_size_title,
                font: font_bold,
            });

            page2.drawText(
                '+ Thưởng chuyên cần: 350.000 vnđ/tháng (nếu làm đủ giờ công trong tháng)',
                {
                    x: 110,
                    y: pageHeight - 695,
                    size: font_size_title,
                    font: font_bold,
                    color: COLOR_BLUE,
                },
            );

            page2.drawText(
                '+ Thưởng tháng 13 (Nếu có ) Đủ một năm làm việc thưởng một tháng lương. Dưới một năm thưởng theo tháng',
                {
                    x: 110,
                    y: pageHeight - 710,
                    size: font_size_title,
                    font: font_bold,
                },
            );

            page2.drawText(
                'thực tế, trên một năm làm việc thưởng theo tình hình SXKD.(NLĐ phải còn làm việc tới thời điểm phát thưởng theo quy định)',
                {
                    x: 20,
                    y: pageHeight - 725,
                    size: font_size_title,
                    font: font_bold,
                },
            );

            page2.drawText('- Được trả lương vào các ngày : Ngày 10 tây hàng tháng.', {
                x: 20,
                y: pageHeight - 740,
                size: font_size_title,
                font,
            });

            page2.drawText(
                'Trong thời hạn 14 ngày làm việc, kể từ ngày chấm dứt hợp đồng, hai bên có trách nhiệm,thanh toán đầy đủ các khoản có liên quan, trường hợp',
                {
                    x: 20,
                    y: pageHeight - 755,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText('đặc biệt không quá 30 ngày.', {
                x: 20,
                y: pageHeight - 770,
                size: font_size_title,
                font,
            });

            page2.drawText(
                '- Khen thưởng: NLĐ được khuyến khích bằng vật chất khi có thành tích trong công tác hoặc theo quy định của công ty.',
                {
                    x: 20,
                    y: pageHeight - 785,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(
                '- Chế độ nâng lương :    Theo quy định của Nhà nước và hằng năm dựa vào tháng nhận việc sẽ xét duyệt tăng 5% so với',
                {
                    x: 20,
                    y: pageHeight - 800,
                    size: font_size_title,
                    font,
                },
            );

            page2.drawText(
                'mức lương cơ bản hiện tại đối với những công nhân viên làm việc đủ 12 tháng trở lên.',
                {
                    x: 20,
                    y: pageHeight - 815,
                    size: font_size_title,
                    font,
                },
            );

            const page3 = pdfDoc.addPage([pageWidth, pageHeight]);

            page3.drawText(
                'Lao động nữ được nghỉ trước và sau khi sinh con là 06 tháng, thời gian nghỉ trước tối đa không quá 02 tháng.',
                {
                    x: 20,
                    y: pageHeight - 20,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                'Trong thời gian mang thai được nghỉ 05 lần đi khám thai và hưởng trợ cấp BHXH.',
                {
                    x: 20,
                    y: pageHeight - 35,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText('- Những thỏa thuận khác', {
                x: 20,
                y: pageHeight - 55,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText(
                'CNV đã ký HĐLĐ khi xin nghỉ việc phải báo Công ty trước 30 ngày đối với HĐ xác định thời hạn và báo',
                {
                    x: 150,
                    y: pageHeight - 55,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                'trước 45 ngày đối với HĐ không xác định thời hạn (từ hợp đồng thứ 3) theo quy định tại điều 35 của Bộ Luật Lao Động. Nếu vi phạm về thời',
                {
                    x: 20,
                    y: pageHeight - 70,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                'hạn báo trước thì dựa theo thực tế số ngày không báo trước để phạt vi phạm thời gian không báo trước, không được trợ cấp thôi việc,phải hoàn',
                {
                    x: 20,
                    y: pageHeight - 85,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                'trả chi phí đào tạo lại cho NSDLĐ (nếu có) (nếu NLĐ đơn phương chấm dứt hợp đồng trái pháp luật).',
                {
                    x: 20,
                    y: pageHeight - 100,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText('Điều 4 : Nghĩa vụ và quyền hạn của người sử dụng lao động.', {
                x: 30,
                y: pageHeight - 115,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText('1. Nghĩa vụ:', {
                x: 20,
                y: pageHeight - 130,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText(
                '- Bảo đảm việc làm và thực hiện đầy đủ những điều đã cam kết trong hợp đồng lao động.',
                {
                    x: 20,
                    y: pageHeight - 145,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '- Thanh toán đầy đủ, đúng thời hạn các chế độ và quyền lợi cho người lao động theo hợp đồng lao động, thoả ước  lao động tập thể (nếu có).',
                {
                    x: 20,
                    y: pageHeight - 160,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText('2. Quyền hạn:', {
                x: 20,
                y: pageHeight - 175,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText(
                '- Điều hành người lao động hoàn thành công việc theo hợp đồng (Bố trí, điều chuyển, tạm ngừng việc ….)',
                {
                    x: 20,
                    y: pageHeight - 190,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '- Có quyền chuyển tạm thời lao động, ngừng việc, thay đổi, tạm thời chấm dứt Hợp đồng lao động và áp dụng các biện pháp',
                {
                    x: 20,
                    y: pageHeight - 205,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                'kỷ luật theo quy định của Pháp luật hiện hành và theo nội quy của Công ty trong thời gian hợp đồng còn giá trị.',
                {
                    x: 20,
                    y: pageHeight - 220,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '- Người sử dụng lao động có quyền điều chuyển Người lao động sang nơi làm việc khác mà Người sử dụng lao động điều hành hoặc làm chủ',
                {
                    x: 20,
                    y: pageHeight - 235,
                    size: font_size_title,
                    font,
                },
            );
            page3.drawText('theo quy định của pháp luật.', {
                x: 20,
                y: pageHeight - 250,
                size: font_size_title,
                font,
            });

            page3.drawText('Điều 5: Đơn phương chấm dứt hợp đồng:', {
                x: 30,
                y: pageHeight - 265,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText('1. Người sử dụng lao động', {
                x: 20,
                y: pageHeight - 280,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText(
                '- Theo quy định tại điều 36 Bộ luật Lao động thì người sử dụng lao động có quyền đơn phương chấm dứt hợp đồng lao động',
                {
                    x: 20,
                    y: pageHeight - 295,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText('trong những trường hợp sau đây:', {
                x: 20,
                y: pageHeight - 310,
                size: font_size_title,
                font,
            });

            page3.drawText(
                '+ Người lao động thường xuyên không hoàn thành công việc theo hợp đồng.',
                {
                    x: 20,
                    y: pageHeight - 325,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '+ Người lao động vi phạm kỷ luật mức sa thải theo nội quy lao động của Công Ty.',
                {
                    x: 20,
                    y: pageHeight - 340,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '+ Người lao động có hành vi gây thiệt hại nghiêm trọng về tài sản và lợi ích của Công ty.',
                {
                    x: 20,
                    y: pageHeight - 355,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '+ Người lao động tự ý bỏ việc 5 ngày trong vòng 30 ngày và 20 ngày cộng dồn trong thời hạn 365 ngày',
                {
                    x: 20,
                    y: pageHeight - 370,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText('tính từ ngày đầu tiên tự ý bỏ việc mà không có lý do chính đáng', {
                x: 20,
                y: pageHeight - 385,
                size: font_size_title,
                font,
            });

            page3.drawText('2. Người lao động', {
                x: 20,
                y: pageHeight - 400,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText(
                '- Khi người lao động đơn phương chấm dứt Hợp đồng lao động trước thời hạn phải tuân thủ theo điều 35 Bộ luật Lao động và phải dựa trên các căn cứ sau:',
                {
                    x: 20,
                    y: pageHeight - 415,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '+ Không được trả công đầy đủ hoặc trả công không đúng thời hạn đã thoả thuận trong hợp đồng.',
                {
                    x: 20,
                    y: pageHeight - 430,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText('+ Bị ngược đãi, bị cưỡng bức lao động.', {
                x: 20,
                y: pageHeight - 445,
                size: font_size_title,
                font,
            });

            page3.drawText(
                '+ Bản thân hoặc gia đình thật sự có hoàn cảnh khó khăn không thể tiếp tục thực hiện hợp đồng.',
                {
                    x: 20,
                    y: pageHeight - 460,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText('+ Người lao động nữ có thai phải nghỉ việc theo chỉ định của bác sĩ.', {
                x: 20,
                y: pageHeight - 475,
                size: font_size_title,
                font,
            });

            page3.drawText(
                '+ Người lao động bị ốm đau, tai nạn đã điều trị 03 tháng liền mà khả năng lao động chưa được hồi phục.',
                {
                    x: 20,
                    y: pageHeight - 490,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '- Ngoài những căn cứ trên, người lao động còn phải đảm bảo thời hạn báo trước theo quy định. Người lao động có ý định thôi việc vì các lý do',
                {
                    x: 20,
                    y: pageHeight - 505,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                'khác thì phải thông báo bằng văn bản cho đại diện của Công ty là Phòng Nhân sự biết trước ít nhất là 15 ngày.',
                {
                    x: 20,
                    y: pageHeight - 520,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText('Điều 6 : Điều khoản thi hành', {
                x: 30,
                y: pageHeight - 535,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText(
                '- Những vấn đề về lao động không ghi trong hợp đồng lao động này thì áp dụng quy định của thoả ước tập thể',
                {
                    x: 30,
                    y: pageHeight - 550,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                'trường hợp chưa có thoả ước tập thể thì áp dụng quy định của pháp luật lao động.',
                {
                    x: 20,
                    y: pageHeight - 570,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                '- Hợp đồng lao động được làm thành 02 bản có giá trị ngang nhau, mỗi bên giữ một bản và có hiệu lực từ',
                {
                    x: 30,
                    y: pageHeight - 585,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(
                `ngày         tháng         năm                  . Khi hai bên ký kết phụ lục hợp đồng lao động thì nội dung của phụ lục hợp đồng lao động`,
                {
                    x: 20,
                    y: pageHeight - 600,
                    size: font_size_title,
                    font,
                },
            );

            page3.drawText(day + '', {
                x: 45,
                y: pageHeight - 600,
                size: font_size_title,
                font,
                color: COLOR_BLUE,
            });

            page3.drawText(month + '', {
                x: 90,
                y: pageHeight - 600,
                size: font_size_title,
                font,
                color: COLOR_BLUE,
            });

            page3.drawText(year + '', {
                x: 130,
                y: pageHeight - 600,
                size: font_size_title,
                font,
                color: COLOR_BLUE,
            });

            page3.drawText('cũng có giá trị như các nội dung của bản hợp đồng lao động này.', {
                x: 20,
                y: pageHeight - 615,
                size: font_size_title,
                font,
            });

            page3.drawText('Hợp đồng làm tại :  ', {
                x: 100,
                y: pageHeight - 630,
                size: font_size_title,
                font,
            });

            page3.drawText(name_unit, {
                x: 210,
                y: pageHeight - 630,
                size: font_size_title + 1,
                font: font_bold,
            });

            page3.drawText(`ngày       tháng      năm    `, {
                x: 330,
                y: pageHeight - 630,
                size: font_size_title + 1,
                font,
            });

            page3.drawText(`${day}`, {
                x: 355,
                y: pageHeight - 630,
                size: font_size_title + 1,
                font,
                color: COLOR_BLUE,
            });

            page3.drawText(`${month}`, {
                x: 400,
                y: pageHeight - 630,
                size: font_size_title + 1,
                font,
                color: COLOR_BLUE,
            });

            page3.drawText(`${year}`, {
                x: 440,
                y: pageHeight - 630,
                size: font_size_title + 1,
                font,
                color: COLOR_BLUE,
            });

            page3.drawText('NGƯỜI LAO ĐỘNG', {
                x: 80,
                y: pageHeight - 650,
                size: font_size_title + 1,
                font: font_bold,
            });

            page3.drawText('(Ký tên)', {
                x: 115,
                y: pageHeight - 665,
                size: font_size_title,
                font,
            });

            page3.drawText('Ghi rõ họ và tên', {
                x: 100,
                y: pageHeight - 680,
                size: font_size_title,
                font,
            });

            page3.drawText('NGƯỜI SỬ DỤNG LAO ĐỘNG', {
                x: 320,
                y: pageHeight - 650,
                size: font_size_title + 1,
                font: font_bold,
            });

            page3.drawText('(Ký tên, đóng dấu)', {
                x: 365,
                y: pageHeight - 665,
                size: font_size_title,
                font,
            });

            page3.drawText('Ghi rõ họ và tên', {
                x: 370,
                y: pageHeight - 680,
                size: font_size_title,
                font,
            });

            page3.drawText(position_boss, {
                x: 370,
                y: pageHeight - 695,
                size: font_size_title,
                font: font_bold,
            });

            page3.drawText(name_boss, {
                x: 370,
                y: pageHeight - 800,
                size: font_size_title + 1,
                font: font_bold,
            });
        }

        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        return pdfDataUri;
    } catch (error) {
        console.log(error);
        return '';
    }
};
