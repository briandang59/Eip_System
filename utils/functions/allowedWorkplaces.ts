import { Role } from '@/types/response/auth';

export type Mode = 'union' | 'intersection';

export function deriveAllowedWorkplaceIds(roles: Role[] = [], mode: Mode = 'union'): number[] {
    const lists = roles.map((r) => (r.work_places ?? []).map((w) => w.id));
    if (lists.length === 0) return [];
    if (mode === 'union') return Array.from(new Set(lists.flat()));
    return lists.reduce<number[]>((acc, cur) => acc.filter((x) => cur.includes(x)), lists[0]);
}
