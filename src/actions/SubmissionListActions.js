/**
 * Created by cpc on 2/24/16.
 */

import SubmissionListConstants from '../constants/SubmissionListConstants';
import { getJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import toast from '../core/toast';
import { isCompleted, isCompileError } from '../check/submission';

export const reciveSubmissionList = (submissionList) => ({
  type: SubmissionListConstants.LOAD_SUCCESS,
  submissionList,
});

export const reciveSubmission = (index, submission) => ({
  type: SubmissionListConstants.LOAD_ONE_SUCCESS,
  index,
  submission,
});

export const changeSubmissionState = (index, content) => ({
  type: SubmissionListConstants.CHANGE_EXPAND_STATE,
  index,
  content,
});

function canSubmissionExpand(state, index) {
  const { submissionList, auth } = state;
  const submission = submissionList.get(index);
  return (submission.get('username') === auth.get('username'));
}

export const getSubmission = (index) => async(dispatch, getState) => {
  try {
    const state = getState();
    if (!canSubmissionExpand(state, index)) return true;
    nprogress.start();
    const sid = state.submissionList.get(index).get('sid');
    const res = await getJSON(`/api/submissions/${sid}`);
    const { submission } = await res.json();
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
    const submission = state.submissionList.get(index);
    if (!isCompleted(submission.get('result'))) {
      setTimeout(() => dispatch(updateSubmissionResult(index)), 200);
      const sid = submission.get('sid');
      const res = await getJSON(`/api/submissions/${sid}`);
      const data = await res.json();
      if (submission.get('result') !== data.submission.result) {
        dispatch(reciveSubmission(index, data.submission));
      }
    }
  } catch (err) {
    toast('error', err.message);
  }
};

export const getSubmissionList = (cond) => async (dispatch) => {
  try {
    nprogress.start();
    const res = await getJSON(`/api/submissions`, cond);
    const { submissionList } = await res.json();
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
      if (!state.submissionList.get(index).has('code')) {
        await dispatch(getSubmission(index));
      }
    } else if (content === 'CEInfo') {
      const { submissionList } = state;
      if (!isCompileError(submissionList.getIn([index, 'result']))) return;
    }

    dispatch(changeSubmissionState(index, content));
  } catch (err) {
    toast('error', err.message);
  }
};
