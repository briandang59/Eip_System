'use client';
import { useAuth } from '@/utils/hooks/useAuth';

export default function HRPage() {
    const { isLoading, hasPermission } = useAuth(['HR_ADMIN', 'HR_USER']);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!hasPermission) {
        return <div>Access Denied</div>;
    }

    return (
        <div>
            <h1>HR Dashboard</h1>
            {/* Your HR page content */}
        </div>
    );
}
