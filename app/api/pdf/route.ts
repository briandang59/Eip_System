import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'empty';

        let filePath: string;
        if (type === 'test') {
            filePath = join(process.cwd(), 'public', 'files', 'test.pdf');
        } else {
            filePath = join(process.cwd(), 'public', 'files', 'empty.pdf');
        }

        const pdfBuffer = readFileSync(filePath);

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });
    } catch (error) {
        console.error('Error serving PDF:', error);
        return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }
}
