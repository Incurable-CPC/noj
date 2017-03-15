/**
 * Created by cpc on 1/7/16.
 */

import { getValues, reset } from 'redux-form/immutable';
import cookie from 'react-cookie';

import AUTH from '../constants/auth';
import { loginChecker, registerChecker, passwordsChecker } from '../check/auth';
import { getJSON, postJSON } from '../core/fetchJSON';
import { updateUser } from './user';
import { hideDialog } from './dialog';
import nprogress from '../core/nprogress';
import toast from '../core/toast';
import { api } from '../config';

const cookieOpt = {
  maxAge: 9000000,
  path: '/',
};

const loginSuccess = (auth) => {
  const { username, token } = auth;
  cookie.save('username', username, cookieOpt);
  cookie.save('token', token, cookieOpt);
};

const setUserInfo = (user) => ({
  type: AUTH.SET,
  user,
});

const clearUserInfo = () => {
  cookie.remove('username', cookieOpt);
  cookie.remove('token', cookieOpt);
  return ({ type: AUTH.CLEAR });
};

export const loadAuthedUserInfo = () => async (dispatch) => {
  try {
    const username = cookie.load('username', cookieOpt);
    if (!username) return;
    const { user } = await getJSON(`${api}/users/${username}`);
    dispatch(setUserInfo(user));
  } catch (err) {
    toast('error', err.message);
  }
};

export const register = () => async(data, dispatch) => {
  try {
    const { username, password, confirmPassword } = data.toJS();
    const error = registerChecker(username, password, confirmPassword);
    if (error) {
      toast('warning', error);
    } else {
      nprogress.start();
      const { token } = await postJSON(`${api}/auth/register`, data);
      toast('success', 'Register succeed', 'Welcome to NJU Online Judge');
      loginSuccess({ username, token });
      await dispatch(loadAuthedUserInfo());
      await dispatch(hideDialog());
    }
  } catch (err) {
    toast('error', err.message);
  }
  await nprogress.done();
};

export const login = () => async(data, dispatch) => {
  try {
    const { username, password } = data.toJS();
    const error = loginChecker(username, password);
    if (error) {
      toast('warning', error);
    } else {
      nprogress.start();
      const { token } = await postJSON(`${api}/auth/login`, data);
      toast('success', 'Login succeed', 'Welcome to NJU Online Judge');
      loginSuccess({ username, token });
      await dispatch(loadAuthedUserInfo());
      await dispatch(hideDialog());
    }
  } catch (err) {
    toast('error', err.message);
  }
  await nprogress.done();
};

export const logout = (option) => async(dispatch) => {
  if (option && option.quiet) {
    dispatch(clearUserInfo());
  } else {
    try {
      nprogress.start();
      await postJSON(`${api}/auth/logout`);
      toast('success', 'Logout succeed');
      dispatch(clearUserInfo());
    } catch (err) {
      toast('error', err.message);
    }
    nprogress.done();
  }
};

export const changePassword = (username) => async (data, dispatch) => {
  try {
    const { oldPassword, password, confirmPassword } = data.toJS();
    const error = passwordsChecker(oldPassword, password, confirmPassword);
    if (error) {
      toast('warning', error);
    } else {
      nprogress.start();
      const { token } = await postJSON(`${api}/auth/passwords`, data);
      toast('success', 'Change password succeed');
      loginSuccess({ username, token });
      await dispatch(updateUser('auth'));
      await dispatch(reset('account'));
    }
  } catch (err) {
    toast('error', err.message);
  }
  await nprogress.done();
};
