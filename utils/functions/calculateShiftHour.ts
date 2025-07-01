export function calculateShiftHour(shift: { start_time: string; end_time: string }): number {
    const [startHour, startMinute] = shift.start_time.split(':').map(Number);
    const [endHour, endMinute] = shift.end_time.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    // Nếu endTime < startTime thì coi là qua ngày hôm sau (ca đêm)
    if (endDate <= startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60); // đổi ms -> giờ

    return parseFloat(diffHours.toFixed(2)); // làm tròn 2 chữ số
}
