({
    "babel": true
})
import { List, Map, toJS, fromJS } from 'immutable';
import {
    isSetFinished,
    isMatchFinished,
} from '../../../src/domain/tide/logic';

import {
    FIRST_SET,
    SECOND_SET,
    THIRD_SET,
    ADD_POINT,
    REMOVE_POINT,
    HOMETEAM,
    AWAYTEAM,
    TEAM,
    SCORE,
    BeachVolleyballSet
} from '../../../src/domain/tide/state';

const score = new BeachVolleyballSet()
console.log(score)

