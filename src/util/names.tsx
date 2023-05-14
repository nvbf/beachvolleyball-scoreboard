export function getInitials(name: string): string {
    const parts = name.split(" ");
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].substring(1);
    return `${firstInitial}. ${lastInitial}`;
}