import { PDFDocument, PDFFont } from 'pdf-lib';
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

const logos = {
    huge_bamboo: images.huge_bamboo.src,
    jyulong: images.jyulong.src,
    longtriumph: images.longtriumph.src,
    default_image_user: images.default_image_user.src,
};

export { loadFont, loadFontBold, loadFontChinese, logos };
