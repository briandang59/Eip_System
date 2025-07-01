export const CheckInPregnancyOrTakeCareChild = (
    start_date: string,
    end_date: string | null,
    record_date: string,
): boolean => {
    const recordDate = new Date(record_date);
    recordDate.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    const startDate = new Date(start_date);
    startDate.setHours(0, 0, 0, 0);

    // Check if record date is before start date
    if (recordDate < startDate) {
        return false;
    }

    // If end_date is null, person is still in pregnancy/child care mode
    if (end_date === null) {
        return true;
    }

    const endDate = new Date(end_date);
    endDate.setHours(0, 0, 0, 0);

    // Check if record date is within the range
    return recordDate <= endDate;
};
