/**
 * Created by cpc on 2/24/16.
 */

import SubmissionListConstants from '../constants/SubmissionListConstants';
import { getJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import toast from '../core/toast';
import { isCompleted } from '../check/submission';

export const reciveSubmissionList = (submissionList) => ({
  type: SubmissionListConstants.LOAD_SUCCESS,
  submissionList,
});

export const reciveSubmission = (index, submission) => ({
  type: SubmissionListConstants.LOAD_ONE_SUCCESS,
  index,
  submission,
});

export const changeSubmissionState = (index) => ({
  type: SubmissionListConstants.CHANGE_EXPAND_STATE,
  index,
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
    const submission = await res.json();
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
      const newSubmission = await res.json();
      if (submission.get('result') !== newSubmission.result) {
        dispatch(reciveSubmission(index, newSubmission));
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
    const submissionList = await res.json();
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

export const expandSubmission = (index) => async (dispatch, getState) => {
  try {
    const state = getState();
    if (!canSubmissionExpand(state, index)) return;
    if (!state.submissionList.get(index).has('code')) {
      await dispatch(getSubmission(index));
    }

    dispatch(changeSubmissionState(index));
  } catch (err) {
    toast('error', err.message);
  }
};
