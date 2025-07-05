import dayjs from 'dayjs';

type ShiftDates = {
    startDate: string; // YYYY-MM-DD của ca bắt đầu
    endDate: string; // YYYY-MM-DD của ca kết thúc
};

/**
 * Trả về { startDate, endDate } cho ca làm.
 *
 * - Nếu start_time vượt quá end_time  ⇒ ca qua nửa đêm → endDate = ngày + 1.
 * - Ngược lại                         ⇒ endDate  = startDate.
 *
 * @param date       Ngày gốc (YYYY-MM-DD)
 * @param start_time Giờ bắt đầu (HH:mm)
 * @param end_time   Giờ kết thúc (HH:mm)
 * @returns          Object chứa hai ngày ISO
 */
export const generateShiftDates = (
    date: string,
    start_time: string,
    end_time: string,
): ShiftDates => {
    const baseDay = dayjs(date, 'YYYY-MM-DD');
    const startTime = dayjs(`1970-01-01T${start_time}`);
    const endTime = dayjs(`1970-01-01T${end_time}`);

    const startDate = baseDay.format('YYYY-MM-DD');
    const endDate = startTime.isAfter(endTime)
        ? baseDay.add(1, 'day').format('YYYY-MM-DD') // qua đêm
        : startDate; // cùng ngày

    return { startDate, endDate };
};
