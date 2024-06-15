import { v4 } from "uuid";
import { Event, EventType, TeamType } from "./types"

export const getDefaultColor = (team: TeamType): string => {
    if (team === TeamType.Home) {
        return "#000000"
    } else {
        return "#777788"
    }
}

export const createAddPointEvent = (team: TeamType, userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.Score,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}
export const finalizeSetEvent = (userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.SetFinalized,
        team: TeamType.None,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}

export const finalizeMatchEvent = (userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.MatchFinalized,
        team: TeamType.None,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}

export const callTimeoutEvent = (team: TeamType, userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.Timeout,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}

export const selectFirstServerEvent = (team: TeamType, player: number, userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.FirstPlayerServer,
        team: team,
        playerId: player,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}

export const selectFirstServingTeamEvent = (team: TeamType, userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.FirstTeamServer,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}

export const pickTeamColorEvent = (team: TeamType, color: string, userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.PickColor,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: color
    }
}

export const setLeftStartTeamEvent = (team: TeamType, userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.LeftSideStartTeam,
        team: team,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}

export const setNoSideSwitchEvent = (userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.NoSideSwitch,
        team: TeamType.None,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}

export const setClearMessageEvent = (userId: string): Event => {
    return {
        id: v4(),
        eventType: EventType.ClearMessage,
        team: TeamType.None,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: ""
    }
}

export const createUndoEvent = (events: Event[], userId: string): Event => {
    const reversedEvents = [...events].reverse();
    const undoneEventIndex = reversedEvents.findIndex((event: Event) => !event.undone && event.eventType !== EventType.Undo);

    if (undoneEventIndex < 0) {
        return {
            id: "",
            eventType: EventType.Undo,
            team: TeamType.None,
            playerId: 0,
            timestamp: Date.now(),
            undone: "",
            author: userId,
            reference: ""
        }
    }
    const actualIndex = undoneEventIndex >= 0 ? events.length - 1 - undoneEventIndex : -1;
    return {
        id: v4(),
        eventType: EventType.Undo,
        team: TeamType.None,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: userId,
        reference: events[actualIndex].id
    }
}

export const getLastValidEvent = (events: Event[]): Event | null => {
    const reversedEvents = events.slice().reverse();
    const undoneEventIndex = reversedEvents.findIndex((event: Event) => !event.undone && event.eventType !== EventType.Undo);

    if (undoneEventIndex < 0) {
        return null
    }
    return reversedEvents[undoneEventIndex]
}