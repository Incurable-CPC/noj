/**
 * Created by cpc on 3/28/16.
 */

import { fromJS } from 'immutable';
import ContestContants from '../constants/ContestConstants';
import { RESULT_VALUES } from '../constants';
import { isAccepted } from '../check/submission';

const initState = fromJS({
  detail: {},
  condition: {},
  list: [],
});

export default (state = initState, action) => {
  switch (action.type) {
    case ContestContants.INIT:
      return state.set('detail', initState.get('detail'));
    case ContestContants.SET:
      return state.set('detail', fromJS(action.contest))
        .setIn(['detail', 'pid'], 'A')
        .update('detail', (contest) => {
          const submissions = contest.get('submissions');
          submissions.forEach((submission) => {
            const pid = submission.get('pid');
            const index = pid.charCodeAt(0) - 'A'.charCodeAt(0);
            contest = contest.update('problems', problems => problems
              .map(problem => problem
                .set('submit', 0)
                .set('accepted', 0)
                .set('ratio', 0)));
            contest = contest.updateIn(['problems', index], (problem) => {
              const inc = (v) => (x) => (x + v);
              problem = problem
                .update('submit', inc(1))
                .update('accepted', inc(isAccepted(submission.get('result'))));
              const { accepted, submit } = problem.toJS();
              return problem.set('ratio', 100 * accepted / submit);
            });
          });
          return contest;
        });
    case ContestContants.SET_PID:
      return state.setIn(['detail', 'pid'], action.pid);
    case ContestContants.SET_LIST:
      return state.set('list', fromJS(action.list))
        .set('condition', fromJS(action.condition))
        .set('count', action.count);
    case ContestContants.SET_SUBMISSION:
      return state.setIn(['detail', 'submissions', action.index, 'code'],
        fromJS(action.submission));
    case ContestContants.CHANGE_SUBMISSION_EXPAND_STATE:
      return state.updateIn(['detail', 'submissions', action.index, 'content'],
        (oldContent) => (oldContent === action.content) ? '' : action.content);
    default: return state;
  }
};
