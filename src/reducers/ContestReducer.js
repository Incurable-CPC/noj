/**
 * Created by cpc on 3/28/16.
 */

import { fromJS } from 'immutable';
import ContestContants from '../constants/ContestConstants';

const initState = fromJS({
  detail: {},
  condition: {},
  list: [],
});

export default (state = initState, action) => {
  switch (action.type) {
    case ContestContants.INIT:
      return state.set('detail', initState.get('detail'));
    case ContestContants.SET:
      return state.set('detail', fromJS(action.contest))
        .setIn(['detail', 'pid'], 'A');
    case ContestContants.SET_PID:
      return state.setIn(['detail', 'pid'], action.pid);
    case ContestContants.SET_LIST:
      return state.set('list', fromJS(action.list))
        .set('condition', fromJS(action.condition))
        .set('count', action.count);
    default: return state;
  }
};
