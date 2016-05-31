/**
 * Created by cpc on 5/30/16.
 */

import { fromJS } from 'immutable';

import UserConstants, { listFields } from '../constants/UserConstants';
import { postJSON, getJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import toast from '../core/toast';
import { api } from '../config';

const setUserInfo = (user) => ({
  type: UserConstants.SET,
  user,
});

let _updateLock = false;
export const updateUser = () => async (dispatch, getState) => {
  const user = getState().user;
  if (_updateLock) return;
  _updateLock = true;
  const username = user.get('username');
  const cond = {};
  listFields.forEach((field) => {
    const skip = user.get(field).size;
    cond[field] = { skip };
  });
  const data = await getJSON(
    `${api}/users/${username}/update`, cond);
  dispatch({
    type: UserConstants.UPDATE,
    updates: fromJS(data.user),
  });
  _updateLock = false;
};

export const loadUserInfo = (username) => async (dispatch) => {
  try {
    nprogress.start();
    const { user } = await getJSON(`${api}/users/${username}`);
    dispatch(setUserInfo(user));
    await nprogress.done();
    return true;
  } catch (err) {
    Location.push('/');
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};

export const followUser = () => async (dispatch, getState) => {
  try {
    nprogress.start();
    const user = getState().user;
    const username = user.get('username');
    await postJSON(`${api}/users/${username}/followers`);
    dispatch(updateUser());
    toast('success', 'Follow succeed');
  } catch (err) {
    toast('error', err.message);
  }
  await nprogress.done();
};
