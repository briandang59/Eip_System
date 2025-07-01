export const formatNumber = (value: number | string): string => {
    if (value === null || value === undefined) return '';

    const [integerPart, decimalPart] = value.toString().split('.');

    const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
};
