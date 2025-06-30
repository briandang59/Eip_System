import { UserInfo } from '@/types/response/auth';

export const getInfomation = (): UserInfo | null => {
    if (typeof window === 'undefined') return null;

    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) return null;

    try {
        return JSON.parse(userInfo);
    } catch (error) {
        console.error('Error parsing user info:', error);
        return null;
    }
};
