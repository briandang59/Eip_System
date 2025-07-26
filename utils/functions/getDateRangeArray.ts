export function getDateRangeArray(start: string, end: string) {
    const arr = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
        arr.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return arr;
}
