// middleware.ts
import { authMiddleware } from '@/middlewares/auth.middleware';

export default authMiddleware;

/**
 * Matcher configuration
 */
export const config = {
    matcher: [
        // Bắt tất cả các routes
        '/',
        '/login',
        '/hr/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
