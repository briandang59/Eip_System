export const formatTimeHHmm = (iso: string | null | undefined): string => {
    if (!iso) return '';

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) return '';

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};
