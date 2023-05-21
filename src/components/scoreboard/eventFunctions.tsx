import { v4 } from "uuid";
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

export const createAddPointEvent = (team: TeamType): Event => {
    return {
        id: v4(),
        eventType: EventType.Score,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: ""
    }
}

export const callTimeoutEvent = (team: TeamType): Event => {
    return {
        id: v4(),
        eventType: EventType.Timeout,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: ""
    }
}

export const selectFirstServerEvent = (team: TeamType, player: number): Event => {
    return {
        id: v4(),
        eventType: EventType.FirstPlayerServer,
        team: team,
        playerId: player,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: ""
    }
}

export const selectFirstServingTeamEvent = (team: TeamType): Event => {
    return {
        id: v4(),
        eventType: EventType.FirstTeamServer,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: ""
    }
}

export const pickTeamColorEvent = (team: TeamType, color: string): Event => {
    return {
        id: v4(),
        eventType: EventType.PickColor,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: color
    }
}

export const setLeftStartTeamEvent = (team: TeamType): Event => {
    return {
        id: v4(),
        eventType: EventType.LeftSideStartTeam,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: ""
    }
}

export const setNoSideSwitchEvent = (): Event => {
    return {
        id: v4(),
        eventType: EventType.NoSideSwitch,
        team: TeamType.None,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: ""
    }
}
