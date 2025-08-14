/**
 * Tính tiền chuyên cần theo số giờ công đã làm trong tháng.
 *
 * @param actualHours - Số giờ làm thực tế trong tháng.
 * @param KP - Số giờ nghỉ không phép
 * @param A - Nghỉ có phép loại A
 * @param C - Nghỉ có phép loại C
 * @param expectedHours - Số giờ công dự kiến trong tháng
 * @returns Số tiền chuyên cần còn lại.
 */
export function calculateCcan(
    actualHours: number,
    KP: number,
    A: number,
    C: number,
    expectedHours: number = 208,
): number {
    const baseReward = 350000;
    const deductionPerBlock = 50000;

    const half_hour_deduction = 4;
    const hours_per_day = 8;

    const limit_hours = expectedHours - 3.5 * hours_per_day;

    if (actualHours < limit_hours) return 0;

    const leave_hours_by_diff = expectedHours - actualHours;
    const total_leave_hours = Math.max(KP + A + C, leave_hours_by_diff);

    const time_leaving = total_leave_hours / half_hour_deduction;

    const money_leaving = time_leaving * deductionPerBlock;

    const money_remaining = Math.max(0, baseReward - money_leaving);

    return Math.max(0, Math.round(money_remaining));
}

export function calculateCCAN_BVE(KP: number, A: number, C: number) {
    const baseReward = 350000;
    const deductionPerBlock = 50000;

    const deduction_hours = A + C + KP;
    const deduction_blocks = Math.floor(deduction_hours / 4);
    const money_leaving = deduction_blocks * deductionPerBlock;
    const money_remaining = Math.max(0, baseReward - money_leaving);

    return Math.max(0, Math.round(money_remaining));
}
