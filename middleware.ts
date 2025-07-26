// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './middlewares/auth.middleware';
import { roleMiddleware } from './middlewares/role.middleware';

export function middleware(request: NextRequest) {
    // --- Inspection redirect logic ---
    const inspection = request.cookies.get('inspection')?.value;
    // inspection có thể là 'true' (string)
    if (inspection === 'true') {
        const { pathname } = request.nextUrl;
        if (pathname === '/hr/workday') {
            const url = request.nextUrl.clone();
            url.pathname = '/hr/workday/v1';
            return NextResponse.redirect(url);
        }
        if (pathname === '/hr/statistical-workday') {
            const url = request.nextUrl.clone();
            url.pathname = '/hr/statistical-workday/v1';
            return NextResponse.redirect(url);
        }
    }

    // First check authentication
    const authResponse = authMiddleware(request);
    if (authResponse.status !== 200) {
        return authResponse;
    }

    // Then check role-based access
    return roleMiddleware(request);
}

/**
 * Matcher configuration
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
