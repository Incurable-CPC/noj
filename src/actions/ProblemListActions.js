/**
 * Created by cpc on 2/24/16.
 */

import ProblemListConstants from '../constants/ProblemListConstants';
import { getJSON } from '../core/fetchJSON';
import toast from '../core/toast';
import nprogress from 'nprogress';

export const reciveProblemList = (problemList) => ({
  type: ProblemListConstants.LOAD_SUCCESS,
  problemList,
});

export const getProblemList = () => async (dispatch) => {
  try {
    nprogress.start();
    const res = await getJSON(`/api/problems`);
    const { problemList } = await res.json();
    dispatch(reciveProblemList(problemList));
  } catch (err) {
    toast('error', err.message);
  }

  nprogress.done();
};
