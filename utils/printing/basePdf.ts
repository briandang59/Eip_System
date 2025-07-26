import { PDFDocument, PDFFont, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import images from '@/assets/images';

const loadFont = async (pdfDoc: PDFDocument): Promise<PDFFont> => {
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch('/fonts/times-new-roman-14.ttf').then((res) => res.arrayBuffer());
    return await pdfDoc.embedFont(fontBytes, { subset: true });
};

const loadFontBold = async (pdfDoc: PDFDocument): Promise<PDFFont> => {
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch('/fonts/tnrm-bold.ttf').then((res) => res.arrayBuffer());
    return await pdfDoc.embedFont(fontBytes, { subset: true });
};

const loadFontChinese = async (pdfDoc: PDFDocument): Promise<PDFFont> => {
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch('/fonts/SIMSUN.ttf').then((res) => res.arrayBuffer());
    return await pdfDoc.embedFont(fontBytes, { subset: true });
};
const getLogoById = (id: number) => {
    if (id === 2) {
        return logos.huge_bamboo;
    } else if (id === 3) {
        return logos.jyulong;
    } else {
        return logos.longtriumph;
    }
};

const getCompanyName = (code: number) => {
    if (code === 2 || code === 3) {
        return 'Huge-Bamboo Enterprise Co.Ltd';
    } else if (code === 4) {
        return 'JYULONG Enterprise Co.Ltd';
    } else {
        return 'Long Triumph Enterprise Co.Ltd';
    }
};
const FontPickNote = (index: number, font_vn: PDFFont, font_tw: PDFFont): PDFFont => {
    if ([1, 3, 5, 8, 10].includes(index)) {
        return font_tw;
    } else {
        return font_vn;
    }
};
const logos = {
    huge_bamboo: images.huge_bamboo.src,
    jyulong: images.jyulong.src,
    longtriumph: images.longtriumph.src,
    default_image_user: images.default_image_user.src,
};
const COLOR_BLUE = rgb(0, 0, 0.9);

export {
    loadFont,
    loadFontBold,
    loadFontChinese,
    getLogoById,
    getCompanyName,
    FontPickNote,
    logos,
    COLOR_BLUE,
};
