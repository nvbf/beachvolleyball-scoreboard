import { DocumentData } from "firebase/firestore";
import { AdminMatch, MatchState } from "./types";
import { getInitials } from "../../util/names";

export function parseAdminMatch(data: DocumentData): AdminMatch {
    const awayTeamName = data.AwayTeam?.Name?.replace(/^\#\d+\s/, "");
    const homeTeamName = data.HomeTeam?.Name?.replace(/^\#\d+\s/, "");
    const [name1, name2] = homeTeamName ? homeTeamName.split(" / ") : ["", ""];
    const [name3, name4] = awayTeamName ? awayTeamName.split(" / ") : ["", ""];
    return {
        matchId: +(data.Number),
        awayTeam: {
            isWinner: data.AwayTeam?.IsWinner || false,
            name: data.AwayTeam?.Name,
            player1: name3.trim(),
            player2: name4.trim()
        },
        currentScore: data.CurrentScore || { ["HOME"]: 0, ["AWAY"]: 0 },
        currentSetScore: data.CurrentSetScore || [],
        startTime: convertToTimestamp(data.Time, data.Date),
        startTimestamp: data.MatchStartTimestamp || 0,
        arenaName: data.Field?.Name || "",
        isStarted: data.IsStarted,
        isFinalized: data.IsFinalized,
        hasWinner: data.HasWinner,
        referee: parseTeamString(data.RefereesTX[0]?.Text || ""),
        homeTeam: {
            isWinner: data.HomeTeam?.IsWinner || false,
            name: data.HomeTeam?.Name || "",
            player1: name1.trim(),
            player2: name2.trim()
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
        return MatchState.Upcoming
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