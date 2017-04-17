import {Tide, initActions} from 'tide'

import State from './state'
import AllAction from './actions'

export default function create() {
  const tide = new Tide()
  tide.setState(new State())
  initActions(tide, {all: AllAction})
  return tide
}