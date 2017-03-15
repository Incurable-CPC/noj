/**
 * Created by cpc on 1/18/16.
 */

import { fromJS } from 'immutable';

import ProblemConstants from '../constants/problem';

const initState = fromJS({
  detail: {
    timeLimitNum: 1000,
    memoryLimitNum: 256,
    samples: [{ input: '', output: '' }],
  },
  condition: {},
  list: [],
});

export default function reducer(state = initState, action) {
  const { type, problem, condition, count, list } = action;
  switch (type) {
    case ProblemConstants.INIT:
      return state.set('detail', initState.get('detail'));
    case ProblemConstants.SET:
      return state.set('detail', fromJS(problem));
    case ProblemConstants.SET_LIST:
      return state.set('list', fromJS(list))
        .set('condition', fromJS(condition))
        .set('count', count);
    default:
      return state;
  }
}
