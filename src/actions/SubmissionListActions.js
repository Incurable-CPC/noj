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

export const getSubmissionList = () => async (dispatch) => {
  try {
    nprogress.start();
    const res = await getJSON(`/api/submissions`);
    const { submissionList } = await res.json();
    dispatch(reciveSubmissionList(submissionList));
  } catch (err) {
    toast('error', err.message);
  }

  nprogress.done();
};
