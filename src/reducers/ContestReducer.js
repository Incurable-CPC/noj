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
  const { type, contest, condition, count, list } = action;
  switch (type) {
    case ContestContants.INIT:
      return state.set('detail', initState.get('detail'));
    case ContestContants.SET:
      return state.set('detail', fromJS(contest));
    case ContestContants.SET_LIST:
      return state.set('list', fromJS(list))
        .set('condition', fromJS(condition))
        .set('count', count);
    default: return state;
  }
};
