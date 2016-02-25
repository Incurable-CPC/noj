/**
 * Created by cpc on 2/24/16.
 */

import { fromJS } from 'immutable';

import ProblemListConstants from '../constants/ProblemListConstants';

const initState = fromJS([]);

export default function reducer(state = initState, action) {
  switch (action.type) {
    case ProblemListConstants.LOAD_SUCCESS:
      return fromJS(action.problemList);
    default:
      return state;
  }
}
