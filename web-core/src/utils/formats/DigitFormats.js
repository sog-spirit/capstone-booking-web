export function formatPercentage(numerator, denominator) {
    const percentage = (numerator / denominator) * 100;
    if (percentage) {
        return percentage.toFixed(2) + '%';
    } else {
        return '0%';
    }
}