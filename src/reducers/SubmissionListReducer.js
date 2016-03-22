/**
 * Created by cpc on 2/24/16.
 */

import { fromJS } from 'immutable';

import SubmissionListConstants from '../constants/SubmissionListConstants';

const initState = fromJS([]);

export default function reducer(state = initState, action) {
  const { type, index, submission } = action;
  switch (type) {
    case SubmissionListConstants.LOAD_SUCCESS:
      return fromJS(action.submissionList);
    case SubmissionListConstants.LOAD_ONE_SUCCESS:
      return state.set(index, fromJS(submission));
    case SubmissionListConstants.CHANGE_EXPAND_STATE:
      return state.updateIn([index, 'expanded'], (expanded) => !expanded);
    default:
      return state;
  }
}
