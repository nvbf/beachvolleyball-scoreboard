import { getTextColorFromBackground } from "../../util/color";
import { Event, EventType, TeamType } from "../types"

export const getTextColor = (events: Event[], team: TeamType): string => {
    return getTextColorFromBackground(getBackgroundColor(events, team))
};

export const getBackgroundColor = (events: Event[], team: TeamType): string => {
    const color = events.find((e) =>
        e.eventType === EventType.PickColor &&
        e.team === team &&
        !e.undone)?.reference;
    return color || getDefaultColor(team);
};

export const getDefaultColor = (team: TeamType): string => {
    if (team === TeamType.Home) {
        return "#000000"
    } else {
        return "#777788"
    }
}
