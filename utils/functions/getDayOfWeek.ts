export const getDayOfWeek = (date: string): string => {
    const day = new Date(date).getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
};
