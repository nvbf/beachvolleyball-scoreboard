import { Set } from "../components/types";

export function isSetDone(set: Set, currentSet: number): boolean {
    if (currentSet === 2){
        if (set.awayTeamScore > 14 || set.homeTeamScore > 14){
            if (Math.abs(set.awayTeamScore - set.homeTeamScore) > 1){
                return true
            }
        }
    }else {
        if (set.awayTeamScore > 20 || set.homeTeamScore > 20){
            if (Math.abs(set.awayTeamScore - set.homeTeamScore) > 1){
                return true
            }
        }
    }
    return false
  }
