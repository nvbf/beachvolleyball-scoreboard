import {Map, List} from 'immutable'
import debug from 'debug'
import {Actions} from 'tide'

import {
  MATCH,
	ACTION_HISTORY, 
  HISTORY,
  MATCH_ID,
  HOMETEAM_POINT,
  AWAYTEAM_POINT,
  HOMETEAM_TIMEOUT_TAKEN,
  AWAYTEAM_TIMEOUT_TAKEN,
  DATE,
  ACTION,
  VALUE,
  MATCHSTATE,
  State,
  Action,
  UNDO,
  ActionHistory,
  CURRENT_SET,
  BeachVolleyballSet,
  constants as c,
} from './state';

import {
  update as storeToLocalStorage 
} from './storage';

import {
  getHometeamPointsInCurrentSet,
  getAwayteamPointsInCurrentSet,
  getCurrentSetIndex,
  getCurrentSet,
  isMatchFinished,
  isSetFinished,
} from './logic';

class AllAction extends Actions {
  mutateAndTrack(key, value) {
      this.mutate(key, (original) => original = value);
      this.mutate(HISTORY, (history) => {
        return history.push(
            new Action({
            DATE: new Date(),
            ACTION: key,
            VALUE: value,
            MATCHSTATE: this.getMatch()
          }))
      });      
      this.track(key, value)
  }

  track =(key, value)  => {
      const state = this.getMatch();
      const index = getCurrentSetIndex(state)
      const action = new ActionHistory({
        [DATE]: new Date(),
        [ACTION]: key,
        [VALUE]: value,
        [HOMETEAM_POINT]: this.get([MATCH, index, HOMETEAM_POINT]),
        [AWAYTEAM_POINT]: this.get([MATCH, index, AWAYTEAM_POINT]),
        [CURRENT_SET]: index
      })
      this.mutate(ACTION_HISTORY, (history) => history.push(action))
      const matchId = this.get([MATCH, MATCH_ID]);
      storeToLocalStorage(matchId, this.getState());
  }
  
  hometeamTakeTimeout = (proxy, event, state = this.getMatch()) => {
    const index  = getCurrentSetIndex(state)
    this.mutateAndTrack([MATCH, index, HOMETEAM_TIMEOUT_TAKEN], true)
  }

  awayteamTakeTimeout = (proxy, event, state = this.getMatch()) => {
    const index  = getCurrentSetIndex(state)
    this.mutateAndTrack([MATCH, index, AWAYTEAM_TIMEOUT_TAKEN], true)
  }
  

  addPointHometeam = (proxy, event, state = this.getState())  => {
    const matchState = state[c.MATCH]
    const index  = getCurrentSetIndex(matchState)
    const currentSet = getCurrentSet(state)
    const currentPoints = getAwayteamPointsInCurrentSet(matchState);
    const currentPoints2 = getHometeamPointsInCurrentSet(matchState);
    const totalPOints = currentPoints + currentPoints2;
    
    const newPoints = currentPoints2 + 1;        
    const newScore = new BeachVolleyballSet({
      [c.HOMETEAM_POINT]: currentSet[c.HOMETEAM_POINT] +1,
      [c.AWAYTEAM_POINT]: currentSet[c.AWAYTEAM_POINTT]
    })
    this.setNotificationsState(state, newScore, totalPOints)
    this.mutateAndTrack([MATCH, index, HOMETEAM_POINT], newPoints)
  }

  addPointAwayteam = (proxy, event, state = this.getState()) => {
    const matchState = state[c.MATCH]
    const index  = getCurrentSetIndex(matchState)
    const currentSet = getCurrentSet(state)
    const currentPoints = getAwayteamPointsInCurrentSet(matchState);
    const currentPoints2 = getHometeamPointsInCurrentSet(matchState);
    const totalPOints = currentPoints + currentPoints2;
    const newPoints = currentPoints + 1;        

    const newScore = new BeachVolleyballSet({
      [c.HOMETEAM_POINT]: currentSet[c.HOMETEAM_POINT] ,
      [c.AWAYTEAM_POINT]: currentSet[c.AWAYTEAM_POINTT] +1
    })

    this.setNotificationsState(state, newScore, totalPOints)
    this.mutateAndTrack([MATCH, index, AWAYTEAM_POINT], newPoints)
  }


  setNotificationsState(state, newPoints, totalPOints) {
    if(isMatchFinished(state)) {
          this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.MATCH_FINISHED_COMPONENT)
      } else if(isSetFinished(newPoints)) {
        this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.SHOW_SET_FINISHED)
      } else if(totalPOints % 7 === 0) {
        this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.SHOW_SWITCH)
      }
  }

  playerOnHomeTeamToServe =(player) => {
      assert((player === 1 || player === 2), "player should be one of 1 or 2.")
      const state = this.getMatch();
      const index  = getCurrentSetIndex(state)
      const firstServer = (player === 1) ? this.getMatch()[c.HOMETEAM_FIRST_PLAYER_NAME] : this.getMatch()[c.HOMETEAM_SECOND_PLAYER_NAME];
      const secondServer = (player === 2) ? this.getMatch()[c.HOMETEAM_FIRST_PLAYER_NAME] : this.getMatch()[c.HOMETEAM_SECOND_PLAYER_NAME];
      const serviceOrder = new List([firstServer, secondServer])
      console.log('hometeam serviceorder', firstServer, secondServer, serviceOrder);
      this.mutateAndTrack([MATCH, index, c.SERVICE_ORDER_HOMETEAM], serviceOrder);
      this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.SHOW_SERVICE_ORDER_DIALOG_PLAYER_AWAYTEAM)
  }

  playerOnAwayTeamToServe = (player) => {
      assert((player === 1 || player === 2), "player should be one of 1 or 2.")
      const state = this.getMatch();
      const currentSetIndex = getCurrentSetIndex(state)
      const firstServer = (player === 1) ? this.getMatch()[c.AWAYTEAM_FIRST_PLAYER_NAME] : this.getMatch()[c.AWAYTEAM_SECOND_PLAYER_NAME];
      const secondServer = (player === 2) ? this.getMatch()[c.AWAYTEAM_FIRST_PLAYER_NAME] : this.getMatch()[c.AWAYTEAM_SECOND_PLAYER_NAME];
      const serviceOrder = new List([firstServer, secondServer])
      console.log('awayteam serviceorder', firstServer, secondServer, serviceOrder);
      this.mutateAndTrack([MATCH, currentSetIndex, c.SERVICE_ORDER_AWAYTEAM], serviceOrder);
      const currentSet = this.getMatch()[currentSetIndex];
      this.mutateAndTrack([MATCH, c.SERVICE_ORDER_IS_SET], true);
      this.mutateAndTrack([MATCH, currentSetIndex, c.SERVICE_ORDER_IS_SET], true);
      this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.SCOREBOARD_COMPONENT)
  }

  cancelSetServiceOrder() {
      const state = this.getMatch();
      const currentSetIndex = getCurrentSetIndex(state)
      this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.SCOREBOARD_COMPONENT)
      this.mutateAndTrack([MATCH, currentSetIndex, c.SERVICE_ORDER_IS_SET], false);
  }

  teamToServe = (team) => {
    const state = this.getMatch()
    console.log('team', team)
    assert((team === c.HOMETEAM || team === c.AWAYTEAM), "team should be one of HOMETEAM or AWAYTEAM constants")
    const index  = getCurrentSetIndex(state)
    this.mutateAndTrack([MATCH, index, c.FIRST_TEAM_TO_SERVE], team);
    this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.SHOW_SERVICE_ORDER_DIALOG_PLAYER_HOMETEAM)
  }

  load = (state) => {
    console.log('LOAD!!');
    console.log(state);
    this.setState(state);
  }

  getMatch =() => {
    return this.get(MATCH)
  }

  undoSetS

  undo = ()  => {
    console.log('UNDO')
    const history = this.get([HISTORY]);
    const secondLastAction = history.pop().last();
    const matchState = secondLastAction.get(MATCHSTATE)
    
    const undoAction = [UNDO].concat(secondLastAction.get(ACTION))
    this.mutate(MATCH, original => original = matchState);
    this.mutate(HISTORY, original => original = history.pop());
    this.track(undoAction, secondLastAction.get(VALUE))
  }

  getPersonsName = (serving, number) => {
    const index = number % 2;
    const bvSet = this.getCurrentSet()
    if(serving === c.HOMETEAM) {
      return bvSet[c.SERVICE_ORDER_HOMETEAM].get(index);
    }
    return bvSet[c.SERVICE_ORDER_AWAYTEAM].get(index)
  }

  getCurrentSet = (match = this.getMatch()) =>  {
    const index = getCurrentSetIndex(match);
    return this.getMatch()[index]
  }
}

function assert(bool, message) {
  if(!bool) {
    throw message;
  }
}


export default AllAction