/**
 * Created by cpc on 2/24/16.
 */

import { fromJS } from 'immutable';

import SubmissionConstants from '../constants/SubmissionConstants';

const initState = fromJS({
  condition: {},
  list: [],
});

export default function reducer(state = initState, action) {
  let { type, index, submission, content, submissionList } = action;
  switch (type) {
    case SubmissionConstants.SET_LIST:
      return state.set('list', fromJS(submissionList));
    case SubmissionConstants.SET:
      submission = fromJS(submission)
        .set('content', state.getIn(['list', index, 'content']));
      return state.setIn(['list', index], submission);
    case SubmissionConstants.CHANGE_EXPAND_STATE:
      return state.updateIn(['list', index, 'content'], (oldContent) =>
        (oldContent === content) ? '' : content);
    default:
      return state;
  }
}
