/**
 * Created by cpc on 2/24/16.
 */

import submissionChecker, { isCompleted, isCompileError } from '../check/submissionChecker';
import SubmissionConstants from '../constants/SubmissionConstants';
import { getJSON, postJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import toast from '../core/toast';
import { api } from '../config';

export const reciveSubmissionList = (submissionList) => ({
  type: SubmissionConstants.SET_LIST,
  submissionList,
});

export const reciveSubmission = (index, submission) => ({
  type: SubmissionConstants.SET,
  index,
  submission,
});

export const changeSubmissionState = (index, content) => ({
  type: SubmissionConstants.CHANGE_EXPAND_STATE,
  index,
  content,
});

export const submit = async (submission) => {
  try {
    const { pid, cid } = submission;
    const error = submissionChecker(submission);
    if (error) {
      toast('warning', error);
      return false;
    }

    nprogress.start();
    const postUrl = (cid) ?
      `${api}/contests/${cid}/submissions` :
      `${api}/submissions`;
    const retUrl = (cid) ?
      `/contests/${cid}/status` :
      `/problems/${pid}/status`;
    await postJSON(postUrl, { submission });
    toast('success', 'Submit succeed');
    await nprogress.done();
    Location.push(retUrl);
    return true;
  } catch (err) {
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

function canSubmissionExpand(state, index) {
  const { submission, auth } = state;
  const username = submission.getIn(['list', index, 'username']);
  return (username === auth.get('username'));
}

export const getSubmission = (index) => async(dispatch, getState) => {
  try {
    const state = getState();
    if (!canSubmissionExpand(state, index)) return true;
    nprogress.start();
    const sid = state.submission.getIn(['list', index, 'sid']);
    const { submission } = await getJSON(`${api}/submissions/${sid}`);
    dispatch(reciveSubmission(index, submission));
    await nprogress.done();
    return true;
  } catch (err) {
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

export const updateSubmissionResult = (index) => async (dispatch, getState) => {
  try {
    const state = getState();
    const submission = state.submission.getIn(['list', index]);
    if (!isCompleted(submission.get('result'))) {
      setTimeout(() => dispatch(updateSubmissionResult(index)), 200);
      const sid = submission.get('sid');
      const data = await getJSON(`${api}/submissions/${sid}`);
      if (submission.get('result') !== data.submission.result) {
        dispatch(reciveSubmission(index, data.submission));
      }
    }
  } catch (err) {}
};

export const getSubmissionList = (cond) => async (dispatch) => {
  try {
    nprogress.start();
    const { submissionList } = await getJSON(`${api}/submissions`, cond);
    dispatch(reciveSubmissionList(submissionList));
    submissionList.forEach((submission, index) => {
      setTimeout(() => dispatch(updateSubmissionResult(index)), 200);
    });
    await nprogress.done();
    return true;
  } catch (err) {
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

export const expandSubmission = (index, content) => async (dispatch, getState) => {
  try {
    const state = getState();
    if (content === 'code') {
      if (!canSubmissionExpand(state, index)) return;
      if (!state.submission.getIn(['list', index]).has('code')) {
        await dispatch(getSubmission(index));
      }
    } else if (content === 'CEInfo') {
      const result = state.submission.getIn(['list', index, 'result']);
      if (!isCompileError((result))) return;
    }

    dispatch(changeSubmissionState(index, content));
  } catch (err) {
    toast('error', err.message);
  }
};
