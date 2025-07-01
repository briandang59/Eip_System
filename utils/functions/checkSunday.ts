export const checkSunday = (date: string) => {
    const day = new Date(date).getDay();
    return day === 0;
};
