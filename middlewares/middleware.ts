import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routes } from '../utils/constants/common/routes';

// Định nghĩa các route cần được bảo vệ và role được phép truy cập
const protectedRoutes = {
    [routes.hr.root]: ['HR_ADMIN', 'HR_USER'],
    [routes.it.root]: ['IT_ADMIN'],
    [routes.factoryInspection.root]: ['FACTORY_INSPECTOR', 'MANAGER'],
    [routes.settings.root]: ['ADMIN'],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const userRole = request.cookies.get('user_role')?.value;
    const path = request.nextUrl.pathname;

    // Kiểm tra nếu route cần được bảo vệ
    const isProtectedRoute = Object.keys(protectedRoutes).some((route) => path.startsWith(route));

    // Nếu không có token và đang truy cập protected route, redirect về trang login
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL(routes.login, request.url));
    }

    // Kiểm tra role permission
    if (isProtectedRoute && userRole) {
        const hasPermission = Object.entries(protectedRoutes).some(
            ([route, allowedRoles]) => path.startsWith(route) && allowedRoles.includes(userRole),
        );

        if (!hasPermission) {
            // Redirect về trang home nếu không có quyền
            return NextResponse.redirect(new URL(routes.home, request.url));
        }
    }

    return NextResponse.next();
}

// Cấu hình các route sẽ chạy qua middleware
export const config = {
    matcher: ['/hr/:path*', '/it/:path*', '/factory-inspection/:path*', '/settings/:path*'],
};
