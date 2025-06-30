import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Roles } from '@/utils/constants/common/roles';
import { menuPermissions } from '@/utils/constants/common/menu-permissions';

export function roleMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip role check for login and forbidden pages
    if (pathname.startsWith('/login') || pathname.startsWith('/forbidden')) {
        return NextResponse.next();
    }

    // Skip role check for Next.js internal routes
    if (pathname.startsWith('/_next/') || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Get user roles from cookies (now it's an array of role tags)
    const userRolesCookie = request.cookies.get('user-roles');

    let userRoleTags: string[] = [];

    try {
        if (userRolesCookie?.value) {
            // Parse the array of role tags directly
            userRoleTags = JSON.parse(userRolesCookie.value) as string[];
        } else {
            return NextResponse.redirect(new URL('/forbidden', request.url));
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/forbidden', request.url));
    }

    // Remove leading slash from pathname for matching
    const normalizedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;

    // Find the matching route in menuPermissions
    let matchingRoute: [string, Roles[]] | undefined;

    // Try exact match first
    if (menuPermissions[normalizedPath]) {
        matchingRoute = [normalizedPath, menuPermissions[normalizedPath]];
    } else {
        // Try prefix match - find the longest matching route
        const matchingRoutes = Object.entries(menuPermissions)
            .filter(([route]) => normalizedPath.startsWith(route))
            .sort(([a], [b]) => b.length - a.length); // Sort by length, longest first

        if (matchingRoutes.length > 0) {
            matchingRoute = matchingRoutes[0];
        }
    }

    if (matchingRoute) {
        const [route, requiredRoles] = matchingRoute;

        // Check if user has any of the required roles
        const hasPermission = userRoleTags.some((roleTag) => {
            // Skip if roleTag is undefined or null
            if (!roleTag) {
                return false;
            }

            const hasRole = requiredRoles.some((role) => {
                // Skip if role is undefined or null
                if (!role) {
                    return false;
                }

                const roleValue = role.toLowerCase().trim();
                const tagValue = roleTag.toLowerCase().trim();
                const matches = roleValue === tagValue;
                return matches;
            });
            return hasRole;
        });

        if (!hasPermission) {
            return NextResponse.redirect(new URL('/forbidden', request.url));
        }
    }
    return NextResponse.next();
}
