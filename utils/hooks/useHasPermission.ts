export const useHasRoles = (key: string): boolean => {
    if (typeof window === 'undefined') return false;

    const raw = localStorage.getItem('roles'); // Đúng là phải lấy từ 'roles'
    if (!raw) return false;

    try {
        const roles = JSON.parse(raw);
        if (!Array.isArray(roles)) return false;

        return roles.some((role: any) => role.tag === key);
    } catch (error) {
        console.error('Invalid roles format', error);
        return false;
    }
};
