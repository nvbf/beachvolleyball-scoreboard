import { List, Map, toJS, fromJS } from "immutable";
import { isSetFinished, isMatchFinished } from "../../../src/domain/tide/logic";

import { BeachVolleyballSet } from "../../../src/domain/tide/state";

describe("BeachVolleyballSet", () => {
  it("Is BeachVolleyballSet finished", () => {
    const score = new BeachVolleyballSet();
    expect(isSetFinished(score)).toEqual(false);
  });
});

//   it('Both have 21 points', () => {
//     const score = List([21, 21])
//     expect(isSetFinished(score)).toEqual(false)
//   })

//   it('Awayteam wins', () => {
//     const score = List([19, 21])
//     expect(isSetFinished(score)).toEqual(true)
//   })

//   it('Hometeam wins close match', () => {
//     const score = List([26, 28])
//     expect(isSetFinished(score)).toEqual(true)
//   })

//   it('Not over yet', () => {
//     const score = List([27, 28])
//     expect(isSetFinished(score)).toEqual(false)
//   })

//   it('Not over yet - 2', () => {
//     const score = List([29, 28])
//     expect(isSetFinished(score)).toEqual(false)
//   })

// })

// describe('Match is over ', () => {
//   it('Hometeam wins', () => {
//     const score1 = List([21, 15]);
//     const score2 = List([21, 15]);
//     const score3 = List([0, 0]);
//     const matchScore = Map({
//         [FIRST_SET]: score1,
//         [SECOND_SET]: score2,
//         [THIRD_SET]: score3
//     })
//     expect(isMatchFinished(matchScore)).toEqual(true)
//   })

//   it('Awayteam wins', () => {
//     const score1 = List([13, 21]);
//     const score2 = List([52, 54]);
//     const score3 = List([0, 0]);
//     const matchScore = Map({
//         [FIRST_SET]: score1,
//         [SECOND_SET]: score2,
//         [THIRD_SET]: score3
//     })
//     expect(isMatchFinished(matchScore)).toEqual(true)
//   })

//   it('close match - finished', () => {
//     const score1 = List([13, 21]);
//     const score2 = List([56, 54]);
//     const score3 = List([19, 21]);
//     const matchScore = Map({
//         [FIRST_SET]: score1,
//         [SECOND_SET]: score2,
//         [THIRD_SET]: score3
//     })
//     expect(isMatchFinished(matchScore)).toEqual(true)
//   })

//  it('Sett is 1 - 1', () => {
//     const score1 = List([13, 21]);
//     const score2 = List([55, 53]);
//     const score3 = List([0, 0]);
//     const matchScore = Map({
//         [FIRST_SET]: score1,
//         [SECOND_SET]: score2,
//         [THIRD_SET]: score3
//     })
//     expect(isMatchFinished(matchScore)).toEqual(false)
//   })
// })

// describe('Reducer- score', () => {
//  it('Reducer - addPoint', () => {
//     const score1 = List([1, 0]);
//     const score2 = List([0, 0]);
//     const score3 = List([0, 0]);
//     const matchScore = Map({
//         [SCORE]: {
//           [FIRST_SET]: score1,
//           [SECOND_SET]: score2,
//           [THIRD_SET]: score3
//         }
//     })
//     const action = Map({
//       'type': ADD_POINT,
//       [TEAM]: HOMETEAM
//     })
//     const result = JSON.stringify(teamReducer(undefined, action))
//     console.log(result)
//     const expected = JSON.stringify(matchScore)
//     console.log(expected);
//     expect(result).toEqual(expected)
//   })

//  it('Reducer - removePoint', () => {
//     const score1 = [19, 21];
//     const score2 = [19, 21];
//     const score2After = [19, 20];
//     const score3 = [0, 0];
//     const stateAfter = {
//         [SCORE]: {
//           [FIRST_SET]: score1,
//           [SECOND_SET]: score2After,
//           [THIRD_SET]: score3
//         }
//     }

//     const state = fromJS({
//         [SCORE]: {
//           [FIRST_SET]: score1,
//           [SECOND_SET]: score2,
//           [THIRD_SET]: score3
//         }
//     })

//     const action = Map({
//       'type': REMOVE_POINT,
//       [TEAM]: AWAYTEAM
//     })
//     const result = teamReducer(state, action).toJS()
//     expect(result).toEqual(stateAfter);
//   })
// })
