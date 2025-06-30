import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/apis/fetcher';

export function authMiddleware(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/login')) {
        if (token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}
