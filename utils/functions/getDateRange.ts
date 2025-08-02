import dayjs from 'dayjs';

/**
 * Trả về mảng ngày liên tiếp giữa startDate và endDate (bao gồm 2 đầu mút)
 * @param dateRange Tuple gồm 2 chuỗi date: [startDate, endDate] format "YYYY-MM-DD"
 * @returns string[] Ví dụ: ["2025-07-02", "2025-07-03", "2025-07-04"]
 *
 * Fix timezone issue: Sử dụng string manipulation để tránh hoàn toàn timezone issues
 */
export function getDateRange(dateRange: string[]): string[] {
    const [startStr, endStr] = dateRange;

    // Parse date string thành components
    const parseDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return { year, month, day };
    };

    const start = parseDate(startStr);
    const end = parseDate(endStr);

    const result: string[] = [];
    let current = { ...start };

    while (
        current.year < end.year ||
        (current.year === end.year && current.month < end.month) ||
        (current.year === end.year && current.month === end.month && current.day <= end.day)
    ) {
        const dateStr = `${current.year}-${String(current.month).padStart(2, '0')}-${String(current.day).padStart(2, '0')}`;
        result.push(dateStr);

        // Move to next day
        const daysInMonth = new Date(current.year, current.month, 0).getDate();
        current.day++;
        if (current.day > daysInMonth) {
            current.day = 1;
            current.month++;
            if (current.month > 12) {
                current.month = 1;
                current.year++;
            }
        }
    }

    // Debug: Log output
    console.log('getDateRange output:', result);

    return result;
}
