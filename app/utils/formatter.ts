export const formatNumber = (value: number | null | undefined, decimalDigits: number = 2): string => {
    const num = (value === null || value === undefined || isNaN(value)) ? 0 : value;

    const formattedValue = num.toLocaleString('en-US', {
        minimumFractionDigits: decimalDigits,
        maximumFractionDigits: decimalDigits,
    });

    return formattedValue.endsWith('.00') ? formattedValue.replace('.00', '') : formattedValue;
};