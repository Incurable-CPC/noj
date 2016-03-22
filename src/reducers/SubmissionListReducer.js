/**
 * Created by cpc on 2/24/16.
 */

import { fromJS } from 'immutable';

import SubmissionListConstants from '../constants/SubmissionListConstants';

const initState = fromJS([]);

export default function reducer(state = initState, action) {
  let { type, index, submission, content } = action;
  switch (type) {
    case SubmissionListConstants.LOAD_SUCCESS:
      return fromJS(action.submissionList);
    case SubmissionListConstants.LOAD_ONE_SUCCESS:
      submission = fromJS(submission);
      submission = submission.set('content', state.getIn([index, 'content']));
      return state.set(index, submission);
    case SubmissionListConstants.CHANGE_EXPAND_STATE:
      return state.updateIn([index, 'content'], (oldContent) =>
        (oldContent === content) ? '' : content);
    default:
      return state;
  }
}
