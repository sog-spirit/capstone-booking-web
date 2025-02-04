export function addTime(inputTime, hourToAdd, minuteToAdd) {
    const [hours, minutes] = inputTime.split(':').map(Number);

    const date = new Date(0, 0, 0, hours, minutes);

    date.setHours(date.getHours() + hourToAdd);
    date.setMinutes(date.getMinutes() + minuteToAdd);

    const newHours = String(date.getHours()).padStart(2, '0');
    const newMinutes = String(date.getMinutes()).padStart(2, '0');

    return `${newHours}:${newMinutes}`;
}