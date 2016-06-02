/**
 * Created by cpc on 5/30/16.
 */

import UserConstants, { listFields } from '../constants/UserConstants';
import AuthConstants from '../constants/AuthConstants';
import { postJSON, getJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import toast from '../core/toast';
import { api } from '../config';

const setUserInfo = (user) => ({
  type: UserConstants.SET,
  user,
});

let _updateLock = {
  auth: false,
  user: false,
};
export const updateUser = (field) => async (dispatch, getState) => {
  const state = getState();
  const user = (field === 'auth') ? state.auth : state.user.get('detail');
  if (_updateLock[field]) return;
  _updateLock[field] = true;
  const username = user.get('username');
  const cond = {};
  listFields.forEach((key) => {
    const skip = user.get(key).size;
    cond[key] = { skip };
  });
  const data = await getJSON(
    `${api}/users/${username}/update`, cond);
  dispatch({
    type: ((field === 'auth') ? AuthConstants : UserConstants).UPDATE,
    updates: data.user,
  });
  _updateLock[field] = false;
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

export const followUser = (follow) => async (dispatch, getState) => {
  try {
    nprogress.start();
    const user = getState().user;
    const username = user.getIn(['detail', 'username']);
    const action = `${follow ? 'F' : 'Unf'}ollow`;
    await postJSON(`${api}/users/${username}/followers`, { follow });
    dispatch(updateUser('user'));
    dispatch(updateUser('auth'));
    toast('success', `${action} succeed`);
  } catch (err) {
    toast('error', err.message);
  }
  await nprogress.done();
};
