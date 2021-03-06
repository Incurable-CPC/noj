/**
 * Created by cpc on 3/27/16.
 */

import moment from 'moment';
import { reset } from 'redux-form/immutable';

import { getJSON, postJSON } from '../core/fetchJSON';
import toast from '../core/toast';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import contestChecker from '../check/contest';
import CONTEST from '../constants/contest';
import { isCompileError } from '../check/submission';
import { getTime } from '../decorators/withTime';
import { api } from '../config';

const setContest = (contest) => ({
  type: CONTEST.SET,
  contest,
});

const setContestList = (condition, count, list) => ({
  type: CONTEST.SET_LIST,
  condition,
  count,
  list,
});

export const setContestPid = (pid) => ({
  type: CONTEST.SET_PID,
  pid,
});

export const initContest = () => ({ type: CONTEST.INIT });

export const getContest = (cid, force) => async (dispatch, getState) => {
  try {
    if (!force) {
      const state = getState();
      if (state.getIn(['contest', 'detail', 'cid']) === Number(cid)) {
        dispatch(updateContest(true));
        return true;
      }
    }
    nprogress.start();
    const { contest } = await getJSON(`${api}/contests/${cid}`);
    dispatch(setContest(contest));
    await nprogress.done();
    clearInterval(_updateInterval);
    _updateInterval = setInterval(
      () => dispatch(updateContest()),
      5000);
    return true;
  } catch (err) {
    Location.push('/');
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

const shouldContestUpdate = (contest) => {
  if (!contest) return false;
  const start = moment(contest.get('start'));
  const duration = Number(contest.get('duration'));
  const end = moment(start).add(duration, 'hours');
  const time = getTime();
  if (time.isBefore(start) || time.isAfter(end)) return false;
  return true;
};

let _updateInterval = null;
let _updateLock = false;
export const updateContest = (force) => async (dispatch, getState) => {
  const state = getState();
  const contest = state.getIn(['contest', 'detail']);
  if (force || shouldContestUpdate(contest)) {
    if (_updateLock) return;
    _updateLock = true;
    const cid = contest.get('cid');
    const cond = {};
    ['submissions', 'clarifyLogs'].forEach((field) => {
      const skip = contest.get(field).size;
      cond[field] = { skip };
    });
    const { submissionList, clarifyLogList } = await getJSON(
      `${api}/contests/${cid}/update`, cond);
    dispatch({
      type: CONTEST.UPDATE,
      submissionList,
      clarifyLogList,
    });
    _updateLock = false;
  }
};

export const postContest = () => async (contest, dispatch) => {
  try {
    const error = contestChecker(contest.toJS());
    if (error) return toast('warning', error);
    nprogress.start();
    const action = contest.cid ? 'saved' : 'added';
    const data = await postJSON(`${api}/contests`, { contest });
    toast('success', `Contest ${action}`);
    dispatch(getContest(data.contest.cid, true));
    Location.push(`/contests/${data.contest.cid}`);
  } catch (err) {
    toast('error', err.message);
  }
  await nprogress.done();
};

export const getContestList = (condition) => async (dispatch) => {
  try {
    // const state = getState();
    // const oldCondition = state.contest.get('condition');
    // if (is(oldCondition, fromJS(condition))) return true;
    nprogress.start();
    const { contestList, count } = await getJSON(`${api}/contests`, condition);
    dispatch(setContestList(condition, count, contestList));
    await nprogress.done();
    return true;
  } catch (err) {
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

export const getContestListByPage = (page) => async(dispatch, getState) => {
  const state = getState();
  const condition = state.getIn(['contest', 'condition']).toJS();
  condition.page = Number(page) || 1;
  return await dispatch(getContestList(condition));
};

export const getContestListSortBy = (sortKey) => async(dispatch, getState) => {
  const state = getState();
  let condition = state.get(['contest', 'condition']).toJS();
  condition.page = 1;
  if (sortKey === condition.sortKey) {
    condition.order = -condition.order;
  } else {
    condition.sortKey = sortKey;
    condition.order = 1;
  }

  return await dispatch(getContestList(condition));
};

export const getContestListByKeyword = (searchKey) => async(dispatch, getState) => {
  const state = getState();
  const condition = state.getIn(['contest', 'condition']).toJS();
  condition.page = 1;
  condition.searchKey = searchKey;
  return await dispatch(getContestList(condition));
};

export const receiveContestSubmission = (index, submission) => ({
  type: CONTEST.SET_SUBMISSION,
  index,
  submission,
});

export const changeContestSubmissionState = (index, content) => ({
  type: CONTEST.CHANGE_SUBMISSION_EXPAND_STATE,
  index,
  content,
});

function canContestSubmissionExpand(state, index) {
  const username = state.getIn(['contest', 'detail', 'submissions', index, 'username']);
  return (username === state.getIn(['auth', 'username']));
}

export const getContestSubmission = (index) => async(dispatch, getState) => {
  try {
    const state = getState();
    if (!canContestSubmissionExpand(state, index)) return true;
    nprogress.start();
    const cid = state.getIn(['contest', 'detail', 'cid']);
    const sid = state.getIn(['contest', 'detail', 'submissions', index, 'sid']);
    const { submission } = await getJSON(`${api}/contests/${cid}/submissions/${sid}`);
    dispatch(receiveContestSubmission(index, submission));
    await nprogress.done();
    return true;
  } catch (err) {
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

export const expandContestSubmission = (index, content) => async (dispatch, getState) => {
  try {
    const state = getState();
    const submission = state.getIn(['contest', 'detail', 'submissions', index]);
    if (content === 'code') {
      if (!canContestSubmissionExpand(state, index)) return;
      if (!submission.has('code')) {
        await dispatch(getContestSubmission(index));
      }
    } else if (content === 'CEInfo') {
      const result = submission.get('result');
      if (!isCompileError((result))) return;
    }

    dispatch(changeContestSubmissionState(index, content));
  } catch (err) {
    toast('error', err.message);
  }
};

export const clarifyContest = () => async (data, dispatch) => {
  try {
    // const error = question.question.trim() !== '';
    // if (error) {
    //   toast('warning', error);
    //   return;
    // }
    nprogress.start();
    const cid = data.get('cid');
    await postJSON(`${api}/contests/${cid}/clarification`, data);
    await dispatch(updateContest(true));
    await dispatch(reset(`clarification${data.get('qid')}`));
    toast('success', 'Post succeed');
  } catch (err) {
    toast('error', err.message);
  }
  await nprogress.done();
};
