/**
 * Created by cpc on 1/7/16.
 */

import { getValues } from 'redux-form';
import cookie from 'react-cookie';
import AUTH from '../constants/auth';
import { loginChecker, registerChecker, passwordsChecker } from '../check/auth';
import { getJSON, postJSON } from '../core/fetchJSON';
import { updateUser } from './user';
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

export const login = () => async(dispatch, getState) => {
  try {
    const state = getState();
    const { username, password } = getValues(state.form.login) || {};
    const error = loginChecker(username, password);
    if (error) {
      toast('warning', error);
    } else {
      nprogress.start();
      dispatch({ type: AUTH.LOGIN });
      const { token } = await postJSON(`${api}/auth/login`, {
        username,
        password,
      });
      toast('success', 'Login succeed', 'Welcome to NJU Online Judge');
      loginSuccess({ username, token });
      await dispatch(loadAuthedUserInfo());
      nprogress.done();
      return true;
    }
  } catch (err) {
    toast('error', err.message);
    nprogress.done();
  }
  return false;
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
      nprogress.done();
    } catch (err) {
      toast('error', err.message);
      nprogress.done();
    }
  }
};

export const register = () => async(dispatch, getState) => {
  let ok = true;
  try {
    const state = getState();
    const { username, password, confirmPassword } = getValues(state.form.register) || {};
    const error = registerChecker(username, password, confirmPassword);
    if (error) {
      toast('warning', error);
      ok = false;
    } else {
      nprogress.start();
      dispatch({ type: AUTH.REGISTER });
      const { token } = await postJSON(`${api}/auth/register`, {
        username,
        password,
        confirmPassword,
      });
      toast('success', 'Register succeed', 'Welcome to NJU Online Judge');
      loginSuccess({ username, token });
      await dispatch(loadAuthedUserInfo());
    }
  } catch (err) {
    toast('error', err.message);
    ok = false;
  }
  await nprogress.done();
  return ok;
};

export const changePassword = (username) => async (passwords, dispatch) => {
  let ok = true;
  try {
    const { oldPassword, password, confirmPassword } = passwords;
    const error = passwordsChecker(oldPassword, password, confirmPassword);
    if (error) {
      toast('warning', error);
      ok = false;
    } else {
      nprogress.start();
      const { token } = await postJSON(`${api}/auth/passwords`, passwords);
      toast('success', 'Change password succeed');
      loginSuccess({ username, token });
      await dispatch(updateUser('auth'));
    }
  } catch (err) {
    toast('error', err.message);
    ok = false;
  }
  await nprogress.done();
  return ok;
};
