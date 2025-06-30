'use client';

import { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { useMenuItems } from '@/utils/constants/ui/menu-items';
import { menuPermissions } from '@/utils/constants/common/menu-permissions';
import { Roles } from '@/utils/constants/common/roles';

type MenuItem = Required<MenuProps>['items'][number];

interface RoleData {
    id: number;
    tag: string;
    name_en: string;
    name_vn: string;
    name_zh: string;
    created_at: string;
    description: string;
    work_places: Array<{
        id: number;
        code: string;
        name: string;
        // ... other work_places properties
    }>;
}

export const useFilteredMenuItems = () => {
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const menuItems = useMenuItems();

    useEffect(() => {
        try {
            const rolesStr = localStorage.getItem('roles');
            if (rolesStr) {
                const rolesData = JSON.parse(rolesStr) as RoleData[];
                // Extract all role tags
                const roleTags = rolesData.map((role) => role.tag);
                setUserRoles(roleTags);
            }
        } catch (error) {
            console.error('Error loading user roles:', error);
        }
    }, []);

    const hasPermission = (key: string): boolean => {
        // Always allow logout
        if (key === 'logout') return true;

        if (!menuPermissions[key]) return false;
        return userRoles.some((roleTag) =>
            menuPermissions[key].some((role) => role.toLowerCase() === roleTag.toLowerCase()),
        );
    };

    const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
        if (!items) return [];

        return items
            .filter((item) => {
                if (!item) return false;

                // Check if user has permission for this menu item
                const hasItemPermission = hasPermission(item?.key?.toString() || '');

                // If it has children, check if any child is accessible
                const itemAsSubMenu = item as { children?: MenuItem[] };
                if (itemAsSubMenu.children) {
                    const filteredChildren = filterMenuItems(itemAsSubMenu.children);
                    return filteredChildren.length > 0 || hasItemPermission;
                }

                return hasItemPermission;
            })
            .map((item) => {
                const itemAsSubMenu = item as { children?: MenuItem[] };
                if (!item || !itemAsSubMenu.children) return item;

                // Recursively filter children
                return {
                    ...item,
                    children: filterMenuItems(itemAsSubMenu.children),
                } as MenuItem;
            });
    };

    return filterMenuItems(menuItems);
};
