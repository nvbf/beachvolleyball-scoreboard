import moment from "moment";

export function timestampToString(timestamp: number) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // padStart is used to add leading zeros
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    const formattedTime = `${hours}:${minutes} - ${day}. ${monthNames[date.getMonth()]}`;
    return formattedTime;
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
