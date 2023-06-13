import { v4 } from "uuid";
import { Event, EventType, TeamType } from "../types"

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
export const finalizeSetEvent = (): Event => {
    return {
        id: v4(),
        eventType: EventType.SetFinalized,
        team: TeamType.None,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: ""
    }
}

export const finalizeMatchEvent = (): Event => {
    return {
        id: v4(),
        eventType: EventType.MatchFinalized,
        team: TeamType.None,
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

export const createUndoEvent = (events: Event[]): Event => {
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
            author: "",
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
        author: "",
        reference: events[actualIndex].id
    }
}
