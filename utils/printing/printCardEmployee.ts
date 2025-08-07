import dayjs from 'dayjs';
import { PDFDocument, rgb } from 'pdf-lib';
import { getLogoById, loadFont, logos } from './basePdf';
import { BasicEmployee } from '@/types/printing/baseEmployee';

export const PrintCardEmployee = async (
    data: BasicEmployee[],
    work_place_id: number,
): Promise<string> => {
    try {


        const pdfDoc = await PDFDocument.create();
        const pageWidth = 595.28;
        const pageHeight = 900;

        const cardWidth = 170;
        const cardHeight = 270;
        const margin = 15;

        const cardsPerRow = 3;
        const cardsPerCol = 3;
        const maxCardsPerPage = cardsPerRow * cardsPerCol;

        const logoBytes = await fetch(getLogoById(work_place_id)).then((res) => res.arrayBuffer());

        const avts = await fetch(logos.default_image_user).then((res) => res.arrayBuffer());

        const logoImage = await pdfDoc.embedPng(logoBytes);
        const font = await loadFont(pdfDoc);

        let page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.setFont(font);

        let x = margin;
        let y = pageHeight - cardHeight - margin;
        let cardCount = 0;

        for (let i = 0; i < data.length; i++) {
            const employee = data[i];

            if (cardCount >= maxCardsPerPage) {
                page = pdfDoc.addPage([pageWidth, pageHeight]);
                x = margin;
                y = pageHeight - cardHeight - margin;
                cardCount = 0;
            }

            // Vẽ khung thẻ (bao khung đầy đủ chiều rộng thẻ)
            page.drawRectangle({
                x,
                y,
                width: cardWidth,
                height: cardHeight,
                borderColor: rgb(235 / 255, 200 / 255, 0),
                borderWidth: 1,
            });

            const rowHeight = 20;
            const textSize = 12;

            // khung logo
            page.drawRectangle({
                x: x,
                y: y + cardHeight - 55,
                width: cardWidth,
                height: 55,
                borderColor: rgb(235 / 255, 200 / 255, 0),
                borderWidth: 1,
            });

            // logo
            page.drawImage(logoImage, {
                x: x + 30,
                y: y + cardHeight - 45,
                width: cardWidth - 60,
                height: 30,
            });

            let employeeImage;
            try {
                if (employee.photo) {
                    console.log('Processing employee photo for:', employee.card_number);
                    // Convert base64 string to ArrayBuffer
                    const base64Data = employee.photo.replace(/^data:image\/[a-z]+;base64,/, '');
                    const binaryString = atob(base64Data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    employeeImage = await pdfDoc.embedJpg(bytes);
                } else {
                    // Sử dụng default image nếu không có photo
                    employeeImage = await pdfDoc.embedPng(avts);
                }
            } catch (error) {
                // Nếu không thể embed ảnh, sử dụng default image
                try {
                    employeeImage = await pdfDoc.embedPng(avts);
                } catch (defaultError) {
                    employeeImage = null;
                }
            }

            // viền ảnh
            page.drawRectangle({
                x: x + 35,
                y: y + cardHeight - 175,
                width: cardWidth - 70,
                height: 110,
                borderColor: rgb(245 / 255, 255 / 255, 0),
                borderWidth: 1,
            });

            // ảnh - chỉ vẽ nếu có ảnh
            if (employeeImage) {
                page.drawImage(employeeImage, {
                    x: x + 40,
                    y: y + cardHeight - 170,
                    width: cardWidth - 80,
                    height: 100,
                });
            }

            // vị trí tên công việc
            const jobTitleText = employee.job_title?.code ?? '';
            const job_title_check = jobTitleText !== '' ? jobTitleText.split('-')[0] : '';

            const codeText = `${job_title_check}- ${employee.card_number}`;
            const codeTextWidth = font.widthOfTextAtSize(codeText, textSize);
            const codeTextX = x + (cardWidth - codeTextWidth) / 2; // Tính toán vị trí X để căn giữa
            page.drawText(codeText, {
                x: codeTextX,
                y: y + cardHeight - 190,
                size: textSize,
                font,
                color: rgb(1, 0, 0),
            });

            let infoY = y + 50;
            const drawCenteredText = (text: string, posY: number) => {
                const textWidth = font.widthOfTextAtSize(text, textSize);
                const textX = x + (cardWidth - textWidth) / 2;
                page.drawRectangle({
                    x: x + 10,
                    y: posY - 5,
                    width: cardWidth - 20,
                    height: rowHeight,
                    borderColor: rgb(245 / 255, 200 / 255, 0),
                    borderWidth: 1,
                });
                page.drawText(text, {
                    x: textX,
                    y: posY,
                    size: textSize,
                    font,
                    color: rgb(0, 0, 0),
                });
            };

            drawCenteredText(`${employee.organization_unit.name_vn ?? ''}`, infoY);
            infoY -= rowHeight;
            drawCenteredText(`${employee.fullname}`, infoY);
            infoY -= rowHeight;
            const date_join = employee.join_company_date2
                ? `${dayjs(employee.join_company_date2 ?? '').format('DD/MM/YYYY')}`
                : `${dayjs(employee.join_company_date ?? '').format('DD/MM/YYYY')}`;

            drawCenteredText(`${date_join}`, infoY);

            x += cardWidth + margin;
            if ((i + 1) % cardsPerRow === 0) {
                x = margin;
                y -= cardHeight + margin;
            }
            cardCount++;
        }

        // const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        // return pdfDataUri;
        const pdfBytes = await pdfDoc.save(); // Trả về Uint8Array (binary)
        const blob = new Blob([pdfBytes], { type: 'application/pdf' }); // Tạo blob
        const blobUrl = URL.createObjectURL(blob); // Tạo URL từ blob
        return blobUrl;
    } catch (error) {

        return '';
    }
};
