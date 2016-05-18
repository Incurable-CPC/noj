/**
 * Created by cpc on 3/28/16.
 */

import { fromJS } from 'immutable';
import moment, { duration } from 'moment';
import { List } from 'immutable';
import ContestContants from '../constants/ContestConstants';
import { isCompleted, isAccepted } from '../check/submission';

const initState = fromJS({
  detail: {},
  condition: {},
  list: [],
});

function addSubmission(contest, submission) {
  const pid = submission.get('pid');
  const index = pid.charCodeAt(0) - 'A'.charCodeAt(0);
  const result = submission.get('result');
  const teamName = submission.get('username');
  const inc = (v) => (x = 0) => (x + v);
  if (!isCompleted(result)) return contest;
  return contest.updateIn(['problems', index], (problem) => {
    problem = problem
      .update('submit', inc(1))
      .update('accepted', inc(isAccepted(result)));
    const { accepted, submit } = problem.toJS();
    return problem.set('ratio', 100 * accepted / submit);
  }).updateIn(['teams', teamName], (team = fromJS({})) => {
    if (team.hasIn(['problems', index, 'solved'])) return team;
    if (isAccepted(result)) {
      const failed = team.getIn(['problems', index, 'failed']) || 0;
      const time = duration(moment(submission.get('date')).diff(contest.get('start')));
      const penalty = duration(time);
      penalty.add(failed * 20, 'minutes').add(team.get('penalty') || 0);
      const isFirst = contest.getIn(['problems', index, 'accepted']) === 0;
      return team.update('solved', inc(1))
        .set('penalty', penalty)
        .setIn(['problems', index, 'solved'], time)
        .setIn(['problems', index, 'isFirst'], isFirst);
    }
    return team.updateIn(['problems', index, 'failed'], inc(1));
  });
}

function addSubmissions(contest, submissions) {
  submissions.forEach((submission) =>
    contest = addSubmission(contest, submission));
  return contest.update('teams', (teams) => teams && teams.sort((teamA, teamB) => {
    const solvedA = teamA.get('solved') || 0;
    const solvedB = teamB.get('solved') || 0;
    const penaltyA = teamA.get('penalty');
    const penaltyB = teamB.get('penalty');
    if (solvedA > solvedB) return -1;
    if (solvedA < solvedB) return 1;
    if (penaltyA < penaltyB) return -1;
    if (penaltyA > penaltyB) return 1;
    return 0;
  }));
}

function addClarifyLog(contest, clarifyLog) {
  let path = ['questions'];
  if (clarifyLog.get('kind') === 1) {
    path = ['questions', clarifyLog.get('qid'), 'answers'];
  }
  return contest.updateIn(path, (_ = new List()) => _.push(clarifyLog));
}

function addClarifyLogs(contest, clarifyLogs) {
  clarifyLogs.forEach((clarifyLog) =>
    contest = addClarifyLog(contest, clarifyLog));
  return contest;
}

export default (state = initState, action) => {
  switch (action.type) {
    case ContestContants.INIT:
      return state.set('detail', initState.get('detail'));
    case ContestContants.SET:
      return state.set('detail', fromJS(action.contest))
        .setIn(['detail', 'pid'], 'A')
        .update('detail', (contest) => {
          contest = contest.update('problems', problems => problems
            .map(problem => problem
              .set('submit', 0)
              .set('accepted', 0)
              .set('ratio', 0)));
          contest = addSubmissions(contest, contest.get('submissions'));
          contest = addClarifyLogs(contest, contest.get('clarifyLogs'));
          return contest;
        });
    case ContestContants.SET_PID:
      return state.setIn(['detail', 'pid'], action.pid);
    case ContestContants.UPDATE:
      return state.update('detail', (contest) => {
        const submissionList = fromJS(action.submissionList);
        const clarifyLogList = fromJS(action.clarifyLogList);
        contest = contest
          .update('submissions', (submissions) =>
            submissions.concat(submissionList))
          .update('clarifyLogs', (clarifyLogs) =>
            clarifyLogs.concat(clarifyLogList));
        contest = addSubmissions(contest, submissionList);
        contest = addClarifyLogs(contest, clarifyLogList);
        return contest;
      });
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
