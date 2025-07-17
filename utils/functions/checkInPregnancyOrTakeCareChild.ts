export const checkInPregnancyOrTakeCareChild = (
    start_date: string | null | undefined,
    end_date: string | null | undefined,
    record_date: string | null | undefined,
): boolean => {
    // Trả về false nếu bất kỳ ngày nào bị thiếu hoặc không hợp lệ
    if (!start_date || !record_date) {
        return false;
    }

    try {
        const recordDate = new Date(record_date);
        recordDate.setHours(0, 0, 0, 0); // Đặt lại thời gian về đầu ngày

        const startDate = new Date(start_date);
        startDate.setHours(0, 0, 0, 0);

        // Kiểm tra xem ngày có hợp lệ không
        if (isNaN(recordDate.getTime()) || isNaN(startDate.getTime())) {
            return false;
        }

        // Nếu record date trước start date, trả về false
        if (recordDate < startDate) {
            return false;
        }

        // Nếu end_date là null hoặc undefined, nhân viên vẫn đang trong chế độ thai sản/chăm sóc con
        if (!end_date) {
            return true;
        }

        const endDate = new Date(end_date);
        endDate.setHours(0, 0, 0, 0);

        // Kiểm tra xem endDate có hợp lệ không
        if (isNaN(endDate.getTime())) {
            return false;
        }

        // Kiểm tra xem record date có nằm trong khoảng không
        return recordDate <= endDate;
    } catch (error) {
        console.error('Lỗi khi phân tích ngày:', error);
        return false;
    }
};
