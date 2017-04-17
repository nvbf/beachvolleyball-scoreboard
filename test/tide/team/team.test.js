import { fromJS } from 'immutable';

import { 
  updateFirstPlayerOnHometeam,
  updateSecondPlayerOnHometeam,
  updateFirstPlayerOnAwayteam,
  updateSecondPlayerOnAwayteam
} from '../../../src/domain/redux/team/action-creator';

import teamReducer from '../../../src/domain/redux/team/reducer';

import {
   UPDATE_PLAYER,
   HOMETEAM, 
   AWAYTEAM,
   FIRST_PLAYER,
   SECOND_PLAYER,
   TEAM,
   PLAYER_NAME, 
   PLAYER_NR,
   COLOR
} from '../../../src/domain/redux/constants';

describe('Players', () => {
  it('Action Creators - updateFirstPlayerOnHometeam', () => {
    const player = 'Sindre Øye Svendby'
    const expectedAction = {
      type: UPDATE_PLAYER,
      [TEAM]: HOMETEAM,
      [PLAYER_NR]: FIRST_PLAYER,
      [PLAYER_NAME]: player,
    }
    expect(updateFirstPlayerOnHometeam(player)).toEqual(expectedAction)
  })

  it('Action Creators - updateSecondPlayerOnHometeam', () => {
    const player = 'Sindre Øye Svendby'
    const expectedAction = {
      type: UPDATE_PLAYER,
      [TEAM]: HOMETEAM,
      [PLAYER_NR]: SECOND_PLAYER,
      [PLAYER_NAME]: player,
    }
    expect(updateSecondPlayerOnHometeam(player)).toEqual(expectedAction)
  })  

  it('Action Creators - updateFirstPlayerOnAwayteam', () => {
    const player = 'Sindre Øye Svendby'
    const expectedAction = {
      type: UPDATE_PLAYER,
      [TEAM]: AWAYTEAM,
      [PLAYER_NR]: FIRST_PLAYER,
      [PLAYER_NAME]: player
    }
    expect(updateFirstPlayerOnAwayteam(player)).toEqual(expectedAction)
  })

  it('Action Creators - updateSecondPlayerOnAwayteam', () => {
    const player = 'Sindre Øye Svendby'
    const expectedAction = {
        type: UPDATE_PLAYER,
        [TEAM]: AWAYTEAM,
        [PLAYER_NR]: SECOND_PLAYER,
        [PLAYER_NAME]: player
      }
    expect(updateSecondPlayerOnAwayteam(player)).toEqual(expectedAction)
  })  

  it('Reducer - should handle UPDATE_PLAYER', () => {
    expect(
      teamReducer(undefined,
        {
          'type': UPDATE_PLAYER,
          [TEAM]: HOMETEAM,
          [PLAYER_NR]: SECOND_PLAYER,
          [PLAYER_NAME]: 'Sindre Øye Svendby',
        }
      )
    ).toEqual(
      expectedResultUpdatePlayer
    )
  })
})

const expectedResultUpdatePlayer = fromJS({
   [HOMETEAM]: {
     [FIRST_PLAYER]: { 
       [PLAYER_NAME]: "" 
      },
      [SECOND_PLAYER]: {
        [PLAYER_NAME]: "Sindre Øye Svendby"
      },
      [COLOR]: ""      
   },
   [AWAYTEAM]: {
     [FIRST_PLAYER]: { 
       [PLAYER_NAME]: "" 
      },
      [SECOND_PLAYER]: {
        [PLAYER_NAME]: ""
      },
      [COLOR]: ""
   }
 });