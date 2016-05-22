/**
 * Created by cpc on 3/27/16.
 */

import moment from 'moment';

import { getJSON, postJSON } from '../core/fetchJSON';
import { is, fromJS } from 'immutable';
import toast from '../core/toast';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import contestChecker from '../check/contestChekcer';
import ContestConstants from '../constants/ContestConstants';
import { isCompileError } from '../check/submissionChecker';
import { getTime } from '../decorators/withTime';

const setContest = (contest) => ({
  type: ContestConstants.SET,
  contest,
});

const setContestList = (condition, count, list) => ({
  type: ContestConstants.SET_LIST,
  condition,
  count,
  list,
});

export const setContestPid = (pid) => ({
  type: ContestConstants.SET_PID,
  pid,
});

export const initContest = () => ({ type: ContestConstants.INIT });

export const getContest = (cid, force) => async (dispatch, getState) => {
  try {
    if (!force) {
      const state = getState();
      if (state.contest.getIn(['detail', 'cid']) === Number(cid)) {
        dispatch(updateContest(true));
        return true;
      }
    }
    nprogress.start();
    const res = await getJSON(`/api/contests/${cid}`);
    const { contest } = await res.json();
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
  const contest = state.contest.get('detail');
  if (force || shouldContestUpdate(contest)) {
    if (_updateLock) return;
    _updateLock = true;
    const cid = contest.get('cid');
    const submissionSkip = contest.get('submissions').size;
    const clarifyLogSkip = contest.get('clarifyLogs').size;
    const res = await getJSON(
      `/api/contests/${cid}/update`, {
        submission: { skip: submissionSkip },
        clarifyLog: { skip: clarifyLogSkip },
      });
    const { submissionList, clarifyLogList } = await res.json();
    dispatch({
      type: ContestConstants.UPDATE,
      submissionList,
      clarifyLogList,
    });
    _updateLock = false;
  }
};

export const postContest = async (contest, dispatch) => {
  try {
    const error = contestChecker(contest);
    if (error) return toast('warning', error);
    nprogress.start();
    const action = contest.cid ? 'saved' : 'added';
    const res = await postJSON('/api/contests', { contest });
    const data = await res.json();
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
    const res = await getJSON(`/api/contests`, condition);
    const { contestList, count } = await res.json();
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
  const condition = state.contest.get('condition').toJS();
  condition.page = Number(page) || 1;
  return await dispatch(getContestList(condition));
};

export const getContestListSortBy = (sortKey) => async(dispatch, getState) => {
  const state = getState();
  const condition = state.contest.get('condition').toJS();
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
  const condition = state.contest.get('condition').toJS();
  condition.page = 1;
  condition.searchKey = searchKey;
  return await dispatch(getContestList(condition));
};

export const reciveContestSubmission = (index, submission) => ({
  type: ContestConstants.SET_SUBMISSION,
  index,
  submission,
});

export const changeContestSubmissionState = (index, content) => ({
  type: ContestConstants.CHANGE_SUBMISSION_EXPAND_STATE,
  index,
  content,
});

function canContestSubmissionExpand(state, index) {
  const { contest, auth } = state;
  const username = contest.getIn(['detail', 'submissions', index, 'username']);
  return (username === auth.get('username'));
}

export const getContestSubmission = (index) => async(dispatch, getState) => {
  try {
    const state = getState();
    if (!canContestSubmissionExpand(state, index)) return true;
    nprogress.start();
    const cid = state.contest.getIn(['detail', 'cid']);
    const sid = state.contest.getIn(['detail', 'submissions', index, 'sid']);
    const res = await getJSON(`/api/contests/${cid}/submissions/${sid}`);
    const { submission } = await res.json();
    dispatch(reciveContestSubmission(index, submission));
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
    const submission = state.contest.getIn(['detail', 'submissions', index]);
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

export const clarifyContest = (clear) => async (values, dispatch) => {
  try {
    // const error = question.question.trim() !== '';
    // if (error) {
    //   toast('warning', error);
    //   return;
    // }
    nprogress.start();
    const { cid } = values;
    const res = await postJSON(
      `/api/contests/${cid}/clarification`,
      values);
    const data = await res.json();
    dispatch(updateContest(true));
    if (clear) clear();
    toast('success', 'Post succeed');
  } catch (err) {
    toast('error', err.message);
  }
  await nprogress.done();
};
