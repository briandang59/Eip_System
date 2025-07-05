/**
 * Tính tiền chuyên cần theo số giờ công đã làm trong tháng.
 *
 * @param actualHours - Số giờ làm thực tế trong tháng.
 * @param KP - Số giờ nghỉ không phép
 * @param A - Nghỉ có phép loại A
 * @param C - Nghỉ có phép loại C
 * @param unit_id - Mã đơn vị (đơn vị đặc biệt có cách tính khác)
 * @param expectedHours - Số giờ công dự kiến trong tháng
 * @returns Số tiền chuyên cần còn lại.
 */
export function calculateCcanV2(
    actualHours: number,

    expectedHours: number = 208,
): number {
    const baseReward = 350000;

    return (baseReward / expectedHours) * actualHours;
}
