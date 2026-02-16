export const formatNumber = (value: number | null | undefined, decimalDigits: number = 2): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return (0).toLocaleString('en-US', {
            minimumFractionDigits: decimalDigits,
            maximumFractionDigits: decimalDigits,
        });
    }

    if (value === 0) return (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalDigits,
        maximumFractionDigits: decimalDigits,
    });

    const formattedValue = value.toLocaleString('en-US', {
        minimumFractionDigits: decimalDigits,
        maximumFractionDigits: decimalDigits,
    });

    return formattedValue;
};