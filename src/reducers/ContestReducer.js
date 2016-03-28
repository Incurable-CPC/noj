/**
 * Created by cpc on 3/28/16.
 */

import { fromJS } from 'immutable';
import ContestContants from '../constants/contestConstants';

const initState = fromJS({
  datail: {},
  condition: {},
  list: [],
});

export default (state = initState, action) => {
  const { type, contest, condition, count, list } = action;
  switch (type) {
    case ContestContants.SET:
      return state.set('detail', fromJS(contest));
    case ContestContants.SET_LIST:
      return state.set('list', fromJS(list))
        .set('condition', fromJS(condition))
        .set('count', count);
    default: return state;
  }
};
