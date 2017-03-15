/**
 * Created by cpc on 1/20/16.
 */

import PROBLEM from '../constants/problem';
import { getJSON, postJSON } from '../core/fetchJSON';
import toast from '../core/toast';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import problemChecker from '../check/problem';
import { api } from '../config';

export const setProblem = (problem) => ({
  type: PROBLEM.SET,
  problem,
});

export const initProblem = () => ({
  type: PROBLEM.INIT,
});

export const postProblem = () => async (problem, dispatch) => {
  try {
    const error = problemChecker(problem.toJS());
    if (error) return toast('warning', error);
    nprogress.start();
    const action = problem.pid ? 'saved' : 'added';
    const data = await postJSON(`${api}/problems`, { problem });
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
    if (state.getIn(['problem', 'detail', 'pid']) === pid) return true;
    nprogress.start();
    const { problem } = await getJSON(`${api}/problems/${pid}`);
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
  type: PROBLEM.SET_LIST,
  condition,
  count,
  list,
});

export const getProblemList = (condition) => async (dispatch) => {
  try {
    // const state = getState();
    // const oldCondition = state.problem.get('condition');
    // if (is(oldCondition, fromJS(condition))) return true;
    nprogress.start();
    const { problemList, count } = await getJSON(`${api}/problems`, condition);
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
  const condition = state.getIn(['problem', 'condition']).toJS();
  condition.page = Number(page) || 1;
  return await dispatch(getProblemList(condition));
};

export const getProblemListSortBy = (sortKey) => async(dispatch, getState) => {
  const state = getState();
  const condition = state.getIn(['problem', 'condition']).toJS();
  condition.page = 1;
  if (sortKey === condition.sortKey) {
    condition.order = -condition.order;
  } else {
    condition.sortKey = sortKey;
    condition.order = 1;
  }

  return await dispatch(getProblemList(condition));
};

export const getProblemListByKeyword = (searchKey) => async(dispatch, getState) => {
  const state = getState();
  const condition = state.getIn(['problem', 'condition']).toJS();
  condition.page = 1;
  condition.searchKey = searchKey;
  return await dispatch(getProblemList(condition));
};
