/**
 * Trả về mảng ngày liên tiếp giữa startISO và endISO (bao gồm 2 đầu mút)
 * @param isoRange Tuple gồm 2 chuỗi ISO‑8601: [startISO, endISO]
 * @returns string[] Ví dụ: ["2025-07-02", "2025-07-03", "2025-07-04"]
 */
export function getDateRange(isoRange: string[]): string[] {
    const [startStr, endStr] = isoRange;

    // Chuẩn hoá thành Date UTC (cắt bỏ giờ‑phút‑giây)
    const toUTCDate = (iso: string) => {
        const d = new Date(iso);
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    };

    let current = toUTCDate(startStr);
    const end = toUTCDate(endStr);

    const result: string[] = [];
    while (current <= end) {
        const yyyy = current.getUTCFullYear();
        const mm = String(current.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(current.getUTCDate()).padStart(2, '0');
        result.push(`${yyyy}-${mm}-${dd}`);

        // sang ngày kế tiếp (UTC) để tránh lệch múi giờ
        current.setUTCDate(current.getUTCDate() + 1);
    }

    return result;
}
