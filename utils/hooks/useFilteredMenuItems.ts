'use client';

import { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { useMenuItems } from '@/utils/constants/ui/menu-items';
import { menuPermissions } from '@/utils/constants/common/menu-permissions';
import Cookies from 'js-cookie';

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

    // Đọc giá trị inspection từ cookie
    const inspection = typeof window !== 'undefined' ? Cookies.get('inspection') : undefined;

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

        // Handle dynamic routes like bulletins/[uuid]
        if (key.includes('[') && key.includes(']')) {
            // Check if any role has permission for this dynamic route pattern
            return Object.keys(menuPermissions).some((permissionKey) => {
                if (permissionKey.includes('[') && permissionKey.includes(']')) {
                    // Convert dynamic route pattern to regex for matching
                    const pattern = permissionKey
                        .replace(/\[.*?\]/g, '[^/]+')
                        .replace(/\//g, '\\/');
                    const regex = new RegExp(`^${pattern}$`);
                    if (regex.test(key)) {
                        // Check if user has any of the required roles for this permission
                        const requiredRoles = menuPermissions[permissionKey];
                        return userRoles.some((roleTag) =>
                            requiredRoles.some(
                                (role) => role.toLowerCase() === roleTag.toLowerCase(),
                            ),
                        );
                    }
                }
                return false;
            });
        }

        if (!menuPermissions[key]) return false;
        return userRoles.some((roleTag) =>
            menuPermissions[key].some((role) => role.toLowerCase() === roleTag.toLowerCase()),
        );
    };

    // Hàm thay thế workday/statistical-workday bằng v1 nếu inspection true
    const transformMenuItemsForInspection = (items: MenuItem[]): MenuItem[] => {
        return items
            .filter((item) => {
                if (!item) return false;
                // Ẩn menu factory inspection nếu inspection true
                if (inspection === 'true' && item.key === 'factoryInspection') return false;
                return true;
            })
            .map((item) => {
                if (!item) return item;
                // Thay thế workday/statistical-workday trong menu HR nếu inspection true
                if (
                    inspection === 'true' &&
                    item.key === 'hr' &&
                    Array.isArray((item as any).children)
                ) {
                    const newChildren = (item as any).children
                        .map((child: MenuItem) => {
                            if (!child) return null;
                            if (child.key === 'hr/workday') {
                                return {
                                    ...child,
                                    key: 'hr/workday/v1',
                                    label: 'Workday',
                                };
                            }
                            if (child.key === 'hr/statistical-workday') {
                                return {
                                    ...child,
                                    key: 'hr/statistical-workday/v1',
                                    label: 'Statistical Workday',
                                };
                            }

                            if (child.key === 'hr/reports') {
                                return {
                                    ...child,
                                    key: 'hr/reports/v1',
                                    label: 'Reports',
                                };
                            }
                            return child;
                        })
                        .filter(Boolean); // Bỏ qua null
                    return {
                        ...item,
                        children: newChildren,
                    };
                }
                // Đệ quy cho các menu khác
                if ((item as any).children) {
                    return {
                        ...item,
                        children: transformMenuItemsForInspection((item as any).children).filter(
                            Boolean,
                        ),
                    };
                }
                return item;
            })
            .filter(Boolean); // Bỏ qua null
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

    // Nếu inspection true thì transform menu trước khi filter
    const finalMenu =
        inspection === 'true'
            ? filterMenuItems(transformMenuItemsForInspection(menuItems))
            : filterMenuItems(menuItems);

    return finalMenu;
};
