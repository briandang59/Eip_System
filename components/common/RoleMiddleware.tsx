'use client';
import { useEffect } from 'react';

export default function RoleMiddleware() {
    useEffect(() => {
        console.log('🚀 RoleMiddleware component mounted');

        const processRoles = () => {
            try {
                // Check if we're in the browser
                if (typeof window === 'undefined') {
                    console.log('❌ Not in browser environment');
                    return;
                }

                const rolesStr = localStorage.getItem('roles');
                console.log('📦 localStorage roles:', rolesStr ? 'Found' : 'Not found');

                if (rolesStr) {
                    console.log('📄 Raw roles data:', rolesStr.substring(0, 100) + '...');

                    // Test if it's valid JSON
                    const rolesData = JSON.parse(rolesStr);
                    console.log('✅ Valid JSON, roles count:', rolesData.length);

                    // Create cookie
                    const cookieValue = `user-roles=${encodeURIComponent(rolesStr)}; path=/; max-age=86400; SameSite=Lax`;
                    document.cookie = cookieValue;

                    console.log('🍪 Cookie set, checking...');

                    // Verify cookie was set
                    const allCookies = document.cookie;
                    console.log('🔍 All cookies:', allCookies);

                    const hasUserRolesCookie = allCookies.includes('user-roles=');
                    console.log(
                        '✅ Cookie verification:',
                        hasUserRolesCookie ? 'SUCCESS' : 'FAILED',
                    );

                    // Only reload once
                    const hasReloaded = sessionStorage.getItem('roles-processed');
                    if (!hasReloaded) {
                        console.log('🔄 First time processing, will reload...');
                        sessionStorage.setItem('roles-processed', 'true');
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    } else {
                        console.log('✅ Already processed, roles should be available');
                    }
                } else {
                    console.log('❌ No roles in localStorage');
                    // Clear any existing cookie
                    document.cookie = 'user-roles=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                }
            } catch (error) {
                console.error('💥 Error in processRoles:', error);
                if (error instanceof Error) {
                    console.error('💥 Error stack:', error.stack);
                }
            }
        };

        // Run immediately
        processRoles();

        // Also run after a small delay
        const timeoutId = setTimeout(processRoles, 200);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return null;
}
