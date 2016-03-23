/**
 * Created by cpc on 2/24/16.
 */

import ProblemListConstants from '../constants/ProblemListConstants';
import { getJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import toast from '../core/toast';

export const reciveProblemList = (problemList) => ({
  type: ProblemListConstants.LOAD_SUCCESS,
  problemList,
});

export const getProblemList = (config) => async (dispatch) => {
  try {
    nprogress.start();
    const { page } = config;
    const res = await getJSON(`/api/problems`, { page });
    const { problemList } = await res.json();
    dispatch(reciveProblemList(problemList));
    await nprogress.done();
    return true;
  } catch (err) {
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};
