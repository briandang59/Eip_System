import { AttendanceV2Type, TimeUpdate } from '@/types/response/attendance';
import { isTimeUpdate } from '../functions/isTimeUpdate';
import { useChangeLanguage } from './useChangeLanguage';

export function useEditedClockTimeInfo(att: AttendanceV2Type | undefined) {
    const T1 = att?.details?.[0]?.workday?.T1;
    const T2 = att?.details?.[0]?.workday?.T2;

    let up1 = '',
        up2 = '';
    let reasonObj: TimeUpdate['reason'] | null = null;

    if (isTimeUpdate(T1)) up1 = T1.update_time;
    if (isTimeUpdate(T2)) {
        up2 = T2.update_time;
        reasonObj = T2.reason ?? null;
    }

    const [d1, t1] = up1.split(' ') ?? ['', ''];
    const [d2, t2] = up2.split(' ') ?? ['', ''];

    const reasonText = useChangeLanguage(
        reasonObj?.reason_en ?? '',
        reasonObj?.reason_zh ?? '',
        reasonObj?.reason_vn ?? '',
    );

    return [up1, up2, reasonText, d1, t1, d2, t2] as const;
}
