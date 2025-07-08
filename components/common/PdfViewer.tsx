interface PdfViewerProps {
    url?: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
    const defaultUrl = '/files/blank.pdf';
    const src = url || defaultUrl;

    return <iframe src={src} width="100%" height="1000px" style={{ border: 'none' }} />;
}
