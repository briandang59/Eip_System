export const calculateMonthH = (year: number, month: number): number => {
    const daysInMonth = new Date(year, month, 0).getDate(); // month 1‑based
    let workingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const dow = new Date(year, month - 1, day).getDay(); // 0 = Chủ nhật
        if (dow !== 0) workingDays++;
    }

    return workingDays * 8;
};
