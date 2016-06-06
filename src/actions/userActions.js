/**
 * Created by cpc on 5/30/16.
 */

import UserConstants, { listFields } from '../constants/UserConstants';
import AuthConstants from '../constants/AuthConstants';
import { postJSON, postFile, getJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import toast from '../core/toast';
import { api } from '../config';
import { checkAvatar, checkInfo } from '../check/userChecker';

const setUserInfo = (user) => ({
  type: UserConstants.SET,
  user,
});

const setUserList = (condition, count, userList) => ({
  type: UserConstants.SET_LIST,
  condition,
  count,
  userList,
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
  nprogress.start();
  const data = await getJSON(
    `${api}/users/${username}/update`, cond);
  nprogress.done();
  dispatch({
    type: ((field === 'auth') ? AuthConstants : UserConstants).UPDATE,
    updates: data.user,
  });
  _updateLock[field] = false;
};

export const getUserInfo = (username) => async (dispatch, getState) => {
  let ok = true;
  try {
    nprogress.start();
    const oldUser = getState().user.get('detail');
    if (oldUser.get('username') === username) {
      await dispatch(updateUser('user'));
    } else {
      const { user } = await getJSON(`${api}/users/${username}`);
      dispatch(setUserInfo(user));
    }
  } catch (err) {
    Location.push('/');
    toast('error', err.message);
    ok = false;
  }
  await nprogress.done();
  return ok;
};

export const getUserList = (condition) => async (dispatch) => {
  let ok = true;
  try {
    nprogress.start();
    const { userList, count } = await getJSON(`${api}/users`, condition);
    dispatch(setUserList(condition, count, userList));
  } catch (err) {
    Location.push('/');
    toast('error', err.message);
    ok = false;
  }
  await nprogress.done();
  return ok;
};

export const getUserListByPage = (page) => async (dispatch, getState) => {
  const state = getState();
  const condition = state.user.get('condition').toJS();
  condition.page = Number(page) || 1;
  return await dispatch(getUserList(condition));
};

export const getUserFollowingList = (username) => async (dispatch, getState) => {
  const state = getState();
  const condition = state.user.get('condition').toJS();
  condition.page = 1;
  condition.follower = username;
  return await dispatch(getUserList(condition));
};

export const followUser = (follow) => async (dispatch, getState) => {
  let ok = true;
  try {
    nprogress.start();
    const user = getState().user;
    const username = user.getIn(['detail', 'username']);
    const action = `${follow ? 'F' : 'Unf'}ollow`;
    await postJSON(`${api}/users/${username}/followers`, { follow });
    await dispatch(updateUser('user'));
    await dispatch(updateUser('auth'));
    toast('success', `${action} succeed`);
  } catch (err) {
    toast('error', err.message);
    ok = false;
  }
  await nprogress.done();
  return ok;
};

export const postAvatar = (avatar) => async (dispatch, getState) => {
  let ok = true;
  try {
    const error = checkAvatar(avatar);
    if (error) {
      toast('warning', error);
      return false;
    }
    nprogress.start();
    const username = getState().auth.get('username');
    await postFile(`${api}/users/${username}/avatar`, { avatar });
    await dispatch(updateUser('auth'));
    toast('success', 'New picture uploaded');
  } catch (err) {
    toast('error', err.message);
    ok = false;
  }
  await nprogress.done();
  return ok;
};

export const postUserInfo = (username) => async (info, dispatch) => {
  let ok = true;
  try {
    let error = checkInfo(info);
    if (error) {
      toast('warning', error);
      return false;
    }
    nprogress.start();
    await postJSON(`${api}/users/${username}/info`, { info });
    await dispatch(updateUser('auth'));
    toast('success', 'Your info updated');
  } catch (err) {
    ok = false;
    toast('error', err.message);
  }
  await nprogress.done();
  return ok;
};
