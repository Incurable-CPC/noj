/**
 * Created by cpc on 2/24/16.
 */

import SubmissionListConstants from '../constants/SubmissionListConstants';
import { getJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import toast from '../core/toast';

export const reciveSubmissionList = (submissionList) => ({
  type: SubmissionListConstants.LOAD_SUCCESS,
  submissionList,
});

export const reciveSubmissionCode = (index, code) => ({
  type: SubmissionListConstants.CODE_LOAD_SUCCESS,
  index,
  code,
});

export const changeSubmissionState = (index) => ({
  type: SubmissionListConstants.CHANGE_EXPAND_STATE,
  index,
});

export const getSubmissionList = (cond) => async (dispatch) => {
  try {
    nprogress.start();
    const res = await getJSON(`/api/submissions`, cond);
    const submissionList = await res.json();
    dispatch(reciveSubmissionList(submissionList));
    await nprogress.done();
    return true;
  } catch (err) {
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

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
    const { code } = await res.json();
    dispatch(reciveSubmissionCode(index, code));
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
