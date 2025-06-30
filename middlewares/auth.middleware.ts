import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/apis/fetcher';

export function authMiddleware(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const { pathname } = request.nextUrl;

    console.log('🚀 Auth Middleware running:', { pathname, hasToken: !!token });

    // ------------ 1. Trang /login ------------
    if (pathname.startsWith('/login')) {
        if (token) {
            // Đã đăng nhập mà vẫn vào /login → đẩy về trang chủ
            console.log('🔄 Redirecting to home from login (has token)');
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // ------------ 2. Mọi route khác ------------
    if (!token) {
        // Chưa đăng nhập → về trang /login
        console.log('🔄 Redirecting to login (no token)');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Đủ điều kiện → cho request đi tiếp
    return NextResponse.next();
}
