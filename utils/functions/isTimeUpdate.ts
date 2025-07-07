import { TimeNormal, TimeUpdate } from '@/types/response/attendance';

export function isTimeUpdate(t: TimeNormal | TimeUpdate | null | undefined): t is TimeUpdate {
    return !!t && ('user_update' in t || 'update_time' in t);
}
