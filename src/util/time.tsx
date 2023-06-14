export function timestampToString(timestamp: number) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // padStart is used to add leading zeros
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = String(date.getFullYear()).substr(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
    return formattedTime;

}