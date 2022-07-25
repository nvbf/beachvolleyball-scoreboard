import { MatchOutcome, NotificationType, Set } from "../components/types";
import { showNotification } from "../store/match/actions";
import { useAppDispatch, useAppSelector } from "../store/store";

export function isSetDone(set: Set, currentSet: number): boolean {
    if (currentSet === 2) {
        if (set.awayTeamScore > 14 || set.homeTeamScore > 14) {
            if (Math.abs(set.awayTeamScore - set.homeTeamScore) > 1) {
                return true
            }
        }
    } else {
        if (set.awayTeamScore > 20 || set.homeTeamScore > 20) {
            if (Math.abs(set.awayTeamScore - set.homeTeamScore) > 1) {
                return true
            }
        }
    }
    return false
}

export function checkOutcome(sets: Set[]): MatchOutcome {
    if (sets[0].homeTeamScore === 0 && sets[0].awayTeamScore === 0) {
        return MatchOutcome.NotStarted
    }
    let homeSets = 0
    let awaySets = 0

    for (let i = 0; i < 3; i++) {
        if (isSetDone(sets[0], 0)) {
            if (sets[0].homeTeamScore > sets[0].awayTeamScore) {
                homeSets++
            } else {
                awaySets++
            }
            if (homeSets === 2) {
                return MatchOutcome.HomeWon
            } else if (awaySets === 2) {
                return MatchOutcome.AwayWon
            }
        } else {
            return MatchOutcome.Live
        }
    }
    return MatchOutcome.Live
}


export function evaluateScores(sets: Set[], currentSet: number) {
    console.log("In useEvaluateScores");

    let sideChange = false
    if (currentSet === 2) {
        sideChange = (sumScores(sets[currentSet]) % 5) === 0 && sumScores(sets[currentSet]) !== 0
    } else {
        sideChange = (sumScores(sets[currentSet]) % 7) === 0 && sumScores(sets[currentSet]) !== 0
    }

    let technicalTimeout = sumScores(sets[currentSet]) === 21 && currentSet !== 2
    if (technicalTimeout) {
        return NotificationType.TechnicalTimeout
    } else if (sideChange) {
        return NotificationType.SwitchSides
    }
    return NotificationType.Nothing
}

export function sumScores(set: Set) {
    return set.awayTeamScore + set.homeTeamScore
}
