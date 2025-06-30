import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { routes } from '../constants/common/routes';

export const useAuth = (requiredRoles?: string[]) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = document.cookie.includes('auth_token');
            const userRole = document.cookie
                .split('; ')
                .find((row) => row.startsWith('user_role='))
                ?.split('=')[1];

            setIsAuthenticated(!!token);

            if (requiredRoles && userRole) {
                setHasPermission(requiredRoles.includes(userRole));
            } else {
                setHasPermission(true);
            }

            setIsLoading(false);

            // Redirect nếu không có quyền
            if (!token) {
                router.push(routes.login);
            } else if (requiredRoles && !requiredRoles.includes(userRole || '')) {
                router.push(routes.home);
            }
        };

        checkAuth();
    }, [router, requiredRoles]);

    return { isLoading, isAuthenticated, hasPermission };
};
