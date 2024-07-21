import moment from "moment";

export function timestampToString(timestamp: number) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // padStart is used to add leading zeros
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes} - ${date.getDate()}. ${getMonthName(date.getMonth())}`;
    return formattedTime;
}

export function timestampToStringHours(timestamp: number) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // padStart is used to add leading zeros
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
}

export function getYear(dateString: string, blankIfThisYear: boolean): string {
    const today = new Date();
    const date = new Date(dateString);

    if (today.getFullYear() === date.getFullYear() && blankIfThisYear) {
        return ""
    }

    return date.getFullYear().toString();
}

export function isOngoing(startDate: string, endDate: string): boolean {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set the time part of the dates to the beginning and end of the day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return today >= start && today <= end;
}

export function isIncoming(startDate: string): boolean {
    const today = new Date();
    const start = new Date(startDate);

    // Set the time part of the dates to the beginning and end of the day
    start.setHours(0, 0, 0, 0);

    return today < start;
}

export function isPast(endDate: string): boolean {
    const today = new Date();
    const end = new Date(endDate);

    // Set the time part of the dates to the beginning and end of the day
    end.setHours(23, 59, 59, 999);

    return today > end;
}

export function dateStringToString(dateString: string) {
    // Split the dateString into year, month, and day components
    const [year, month, day] = dateString.split('-');

    // Create a new Date object using the year, month, and day values
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    // padStart is used to add leading zeros
    const formattedDate = `${String(date.getDate())}. ${getMonthName(date.getMonth())}`;
    return formattedDate;
}

function getMonthName(month: number) {
    const monthNames = [
        "jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"
    ];
    return monthNames[month];
}

export function getDelayString(timestamp: number) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);
    let now = Date.now();
    if (now < timestamp) {
        return "";
    }

    const elapsed = timestamp === 0 ? moment.duration(0) : moment.duration(now - timestamp)
    let hours = elapsed.hours().toString()
    let minutes = elapsed.minutes().toString().padStart(2, '0');

    const formattedTime = ` (+${hours}:${minutes} late)`
    return formattedTime;
}

export function getLateStart(startTime: number, started: number) {
    if (started < startTime) {
        return "";
    }

    const elapsed = startTime === 0 ? moment.duration(0) : moment.duration(started - startTime)
    let hours = elapsed.hours().toString()
    let minutes = elapsed.minutes().toString().padStart(2, '0');

    const formattedTime = ` (+${hours}:${minutes} late)`
    return formattedTime;
}
