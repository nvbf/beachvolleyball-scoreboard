import { DocumentData } from "firebase/firestore";
import { AdminMatch, MatchState } from "../tournamentAdmin/types";
import { getInitials } from "../../util/names";

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