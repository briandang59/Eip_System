'use client';

import { Role } from '@/types/response/auth';
import { useEffect, useMemo, useState } from 'react';

function safeParseRoles(raw: string | null): Role[] {
    if (!raw) return [];
    try {
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return [];
        // validate nhẹ: cần có id & work_places (nếu có) là mảng
        return data
            .filter((r) => typeof r?.id === 'number')
            .map((r) => ({
                id: r.id,
                tag: String(r.tag ?? ''),
                name_en: r.name_en,
                name_vn: r.name_vn,
                name_zh: r.name_zh,
                description: r.description,
                work_places: Array.isArray(r.work_places)
                    ? r.work_places
                          .filter((w: any) => typeof w?.id === 'number')
                          .map((w: any) => ({ id: w.id, code: w.code, name: w.name }))
                    : [],
            })) as Role[];
    } catch {
        return [];
    }
}

export function useRolesFromLocalStorage(key = 'app_roles') {
    const [raw, setRaw] = useState<string | null>(null);

    // load once on mount
    useEffect(() => {
        setRaw(typeof window !== 'undefined' ? localStorage.getItem(key) : null);
    }, [key]);

    // listen cross-tab updates
    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === key) setRaw(e.newValue);
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [key]);

    const roles = useMemo(() => safeParseRoles(raw), [raw]);

    return {
        roles,
        setRoles: (val: Role[]) => {
            localStorage.setItem(key, JSON.stringify(val));
            setRaw(JSON.stringify(val));
        },
    };
}
