/**
 * Created by cpc on 1/20/16.
 */

import ProblemConstants from '../constants/ProblemConstants';
import { getJSON, postJSON } from '../core/fetchJSON';
import toast from '../core/toast';
import nprogress from 'nprogress';
import Location from '../core/Location';

export const setProblem = (problem) => ({
  type: ProblemConstants.SET,
  problem,
});

export const initProblem = () => ({
  type: ProblemConstants.INIT,
});

export const postProblem = async (problem, dispatch) => {
  try {
    nprogress.start();
    const action = problem.pid ? 'Saved' : 'Added';
    const res = await postJSON('/api/problems', { problem });
    const data = await res.json();
    dispatch(setProblem(data.problem));
    toast('success', `Problem ${action}`);
    Location.push(`/problems/${problem.pid}`);
  } catch (err) {
    toast('error', err.message);
  }

  nprogress.done();
};

export const getProblem = (pid) => async (dispatch, getState) => {
  try {
    const state = getState();
    if (state.problem.get('pid') === pid) return;
    nprogress.start();
    const res = await getJSON(`/api/problems/${pid}`);
    const { problem } = await res.json();
    dispatch(setProblem(problem));
  } catch (err) {
    toast('error', err.message);
    Location.push('/');
  }

  nprogress.done();
};
