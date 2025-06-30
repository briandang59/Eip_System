import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(
        {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            timezone: 'Asia/Ho_Chi_Minh',
        },
        { status: 200 }
    );
} 