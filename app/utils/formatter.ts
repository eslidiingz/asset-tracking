export const formatNumber = (value: number, decimalDigits: number = 2): string => {
    if (value === 0) return '0.00';

    const formattedValue = value.toLocaleString('en-US', {
        minimumFractionDigits: decimalDigits,
        maximumFractionDigits: decimalDigits,
    });

    return formattedValue.endsWith('.00') ? formattedValue.replace('.00', '') : formattedValue;
};