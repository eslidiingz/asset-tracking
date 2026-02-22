export const getCurrentRatio = (value: number, totalValue: number) => (totalValue > 0 ? (value / totalValue) * 100 : 0)

export const handleNumericInput = (value: string, maxFractionDigits: number = 8) => {
    // Allow only digits and one dot
    let sanitized = value.replace(/[^0-9.]/g, '');

    // Ensure only one dot
    const parts = sanitized.split('.');
    if (parts.length > 2) {
        sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit fraction digits
    if (sanitized.includes('.')) {
        const [intPart, fracPart] = sanitized.split('.');
        if (fracPart && fracPart.length > maxFractionDigits) {
            sanitized = `${intPart}.${fracPart.substring(0, maxFractionDigits)}`;
        }
    }

    return sanitized;
}
