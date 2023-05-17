export function getInitials(names: string) {
    // Split the names into an array
    const nameArr = names.split(' ');

    // Get the last name
    const lastName = nameArr.pop();

    // Create initials for each name except the last name
    const initials = nameArr.map((name) => name.charAt(0).toUpperCase() + '.');

    // Combine initials and the last name
    const result = [...initials, lastName].join(' ');

    return result;
}