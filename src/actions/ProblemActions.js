/**
 * Created by cpc on 1/20/16.
 */

import { fromJS, is } from 'immutable';

import ProblemConstants from '../constants/ProblemConstants';
import { getJSON, postJSON } from '../core/fetchJSON';
import toast from '../core/toast';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import checkProblem from '../check/problem';

export const setProblem = (problem) => ({
  type: ProblemConstants.SET,
  problem,
});

export const initProblem = () => ({
  type: ProblemConstants.INIT,
});

export const postProblem = async (problem, dispatch) => {
  try {
    const error = checkProblem(problem);
    if (error) {
      toast('warning', error);
      return;
    }

    nprogress.start();
    const action = problem.pid ? 'Saved' : 'Added';
    const res = await postJSON('/api/problems', { problem });
    const data = await res.json();
    dispatch(setProblem(data.problem));
    toast('success', `Problem ${action}`);
    Location.push(`/problems/${data.problem.pid}`);
  } catch (err) {
    toast('error', err.message);
  }

  await nprogress.done();
};

export const getProblem = (pid) => async (dispatch, getState) => {
  try {
    const state = getState();
    if (state.problem.getIn(['detail', 'pid']) === pid) return true;
    nprogress.start();
    const res = await getJSON(`/api/problems/${pid}`);
    const { problem } = await res.json();
    dispatch(setProblem(problem));
    await nprogress.done();
    return true;
  } catch (err) {
    Location.push('/');
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

export const setProblemList = (condition, count, list) => ({
  type: ProblemConstants.SET_LIST,
  condition,
  count,
  list,
});

export const getProblemList = (condition) => async (dispatch, getState) => {
  try {
    const state = getState();
    const oldCondition = state.problem.get('condition');
    if (is(oldCondition, fromJS(condition))) return true;
    nprogress.start();
    const { page } = condition;
    const res = await getJSON(`/api/problems`, { page });
    const { problemList, count } = await res.json();
    dispatch(setProblemList(condition, count, problemList));
    await nprogress.done();
    return true;
  } catch (err) {
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

export const getProblemListByPage = (page) => async(dispatch, getState) => {
  const state = getState();
  const condition = state.problem.get('condition').set('page', page).toJS();
  return await dispatch(getProblemList(condition));
};
