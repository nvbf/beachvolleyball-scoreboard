import { init} from '../util/auth'
import firebase from 'firebase';

export function save(matchId, match) {
  init()
  firebase.database().ref('matches/' + matchId).set(match)
}