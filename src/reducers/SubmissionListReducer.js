/**
 * Created by cpc on 2/24/16.
 */

import { fromJS } from 'immutable';

import SubmissionListConstants from '../constants/SubmissionListConstants';

const initState = fromJS([]);

export default function reducer(state = initState, action) {
  switch (action.type) {
    case SubmissionListConstants.LOAD_SUCCESS:
      return fromJS(action.submissionList);
    default:
      return state;
  }
}
