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

