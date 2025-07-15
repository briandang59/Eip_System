import { AttendanceV2Type } from '@/types/response/attendance';
import { useEditedClockTimeInfo } from '@/utils/hooks/useEditedClockTimeInfo';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

// ─── sub‑component cho case 'edited_clock_time' ───
export function EditedClockTime({ selectedAttendance }: { selectedAttendance: AttendanceV2Type }) {
    const { t } = useTranslationCustom();
    const [update1, update2, reasonText, date1, time1, date2, time2] =
        useEditedClockTimeInfo(selectedAttendance);

    return (
        <div className="grid grid-cols-2 gap-4">
            <p className="text-[16px] font-bold">{t.workday.user_update}</p>
            <p className="text-[14px] text-blue-600 font-medium">
                {selectedAttendance?.details[0]?.attendance[0]?.T1?.method}
            </p>

            <p className="text-[16px] font-bold">{t.workday.time_update}</p>
            <p className="text-[14px] text-red-600 font-medium">{update1 || update2 || '-'}</p>

            <p className="text-[16px] font-bold">{t.workday.reason}</p>
            <p className="text-[14px] text-blue-600 font-medium">{reasonText || '-'}</p>

            <p className="text-[16px] font-bold">{t.workday.clock_in_date_edit}</p>
            <p className="text-[14px] font-medium">
                <span className="text-purple-600">{date1 || '-'}</span>{' '}
                <span className="text-red-600">{time1}</span>
            </p>

            <p className="text-[16px] font-bold">{t.workday.clock_out_date_edit}</p>
            <p className="text-[14px] font-medium">
                <span className="text-purple-600">{date2 || '-'}</span>{' '}
                <span className="text-red-600">{time2}</span>
            </p>
        </div>
    );
}
