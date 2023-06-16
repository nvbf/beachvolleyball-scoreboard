import { DocumentData } from "firebase/firestore";
import { AdminMatch, MatchState } from "./types";
import { getInitials } from "../../util/names";

export function parseAdminMatch(data: DocumentData): AdminMatch {
    return {
        matchId: +(data.Number),
        awayTeam: {
            isWinner: data.AwayTeam?.IsWinner || false,
            name: data.AwayTeam?.Name
        },
        currentScore: data.CurrentScore || { ["HOME"]: 0, ["AWAY"]: 0 },
        currentSetScore: data.CurrentSetScore || [],
        startTime: convertToTimestamp(data.Time, data.Date),
        arenaName: data.Field?.Name || "",
        isStarted: data.IsStarted,
        isFinalized: data.IsFinalized,
        hasWinner: data.HasWinner,
        referee: parseTeamString(data.RefereesTX[0]?.Text || ""),
        homeTeam: {
            isWinner: data.HomeTeam?.IsWinner || false,
            name: data.HomeTeam?.Name || ""
        },
        matchCategory: data.MatchCategory?.CategoryCode || "",
        matchGroup: data.MatchGroup?.Name || "",
        sets: data.Sets,
        name: data.Name,
        scoreboardID: data.ScoreboardId,
    };
}

function convertToTimestamp(time: string, date: string): number {
    const dateStr = `${date}T${time}`;
    const dateObj = new Date(dateStr);

    // convert to milliseconds since epoch
    const timestampInMilliseconds = dateObj.getTime();

    return timestampInMilliseconds;
}

function parseTeamString(team: string): string {
    if (team === ""){
        return ""
    }

    // convert to milliseconds since epoch
    const teamNames = team.replace(/^\#\d+\s/, "");

    const [name1, name2] = teamNames ? teamNames.split(" / ") : ["", ""];

    if (!name2) {
        return name1;
    }

    return `${getInitials(name1)} / ${getInitials(name2)}`;
}

export function getMatchState(match: AdminMatch): MatchState {
    if (match.hasWinner) {
        return MatchState.Reported
    } else if (match.isFinalized) {
        return MatchState.Finished
    } else if (match.isStarted) {
        return MatchState.Ongoing
    } else {
        return MatchState.Upcomming
    }
}

export function getStatusColor(state: MatchState): string {
    switch (state) {
        case MatchState.Reported:
            return "#FFEE93"
        case MatchState.Finished:
            return "#ADF7B6"
        case MatchState.Ongoing:
            return "#A0CED9"
        default:
            return "#FFC09F"
    }
}