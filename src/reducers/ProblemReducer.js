/**
 * Created by cpc on 1/18/16.
 */

import { fromJS } from 'immutable';

import ProblemConstants from '../constants/ProblemConstants';

const initState = fromJS({
  timeLimit: 1000,
  memoryLimit: 256,
  samples: [{ input: '', output: '' }],
});

export default function reducer(state = initState, action) {
  switch (action.type) {
    case ProblemConstants.SET:
      return fromJS(action.problem);
    case ProblemConstants.INIT:
      return initState;
    default:
      return state;
  }
}
