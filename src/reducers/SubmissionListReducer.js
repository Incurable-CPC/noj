/**
 * Created by cpc on 2/24/16.
 */

import { fromJS } from 'immutable';

import SubmissionListConstants from '../constants/SubmissionListConstants';

const initState = fromJS([]);

export default function reducer(state = initState, action) {
  const { index, code } = action;
  switch (action.type) {
    case SubmissionListConstants.LOAD_SUCCESS:
      return fromJS(action.submissionList);
    case SubmissionListConstants.CODE_LOAD_SUCCESS:
      return state.update(index, (submission) => submission.set('code', code));
    case SubmissionListConstants.CHANGE_EXPAND_STATE:
      return state.updateIn([index, 'expanded'], (expanded) => !expanded);
    default:
      return state;
  }
}
