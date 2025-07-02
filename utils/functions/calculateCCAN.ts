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
export function calculateCcan(
    actualHours: number,
    KP: number,
    A: number,
    C: number,
    unit_id: number = 0,
    expectedHours: number = 208,
): number {
    const baseReward = 350000;
    const deductionPerBlock = 50000;

    const LT_BVE_UNIT_ID = 151;

    const half_hour_deduction = unit_id === LT_BVE_UNIT_ID ? 5 : 4;
    const hours_per_day = unit_id === LT_BVE_UNIT_ID ? 10 : 8;

    const limit_hours = expectedHours - 3.5 * hours_per_day;

    // Nếu không đạt điều kiện tối thiểu về giờ công => mất toàn bộ chuyên cần
    if (actualHours < limit_hours) return 0;

    // Tổng số giờ nghỉ
    const leave_hours_by_diff = expectedHours - actualHours;
    const total_leave_hours = Math.max(KP + A + C, leave_hours_by_diff);

    // Số block nghỉ (mỗi block = 4h hoặc 5h)
    const time_leaving = total_leave_hours / half_hour_deduction;

    // Tiền bị trừ
    const money_leaving = time_leaving * deductionPerBlock;

    // Tiền chuyên cần còn lại (không nhỏ hơn 0)
    const money_remaining = Math.max(0, baseReward - money_leaving);

    return Math.max(0, Math.round(money_remaining));
}
