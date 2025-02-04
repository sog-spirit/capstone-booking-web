export const LOCALE = {
    VIET_NAM: 'vi-VN',
};

export function formatTimestamp(timestamp, locale = LOCALE.VIET_NAM) {
    let date = new Date(timestamp);
    return date.toLocaleString(locale);
}

export function formatDate(date, locale = LOCALE.VIET_NAM) {
    const dateObj = new Date(date);
    const formatter = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return formatter.format(dateObj);
}

export function trimTime(time) {
    return time.split(':').slice(0, 2).join(':');
}