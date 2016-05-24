/**
 * Created by cpc on 1/7/16.
 */

import { getValues } from 'redux-form';
import cookie from 'react-cookie';
import AuthConstants from '../constants/AuthConstants';
import { loginChecker, registerChecker } from '../check/authChecker';
import { getJSON, postJSON } from '../core/fetchJSON';
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
  type: AuthConstants.SET,
  user,
});

const clearUserInfo = () => {
  cookie.remove('username', cookieOpt);
  cookie.remove('token', cookieOpt);
  return ({ type: AuthConstants.CLEAR });
};

export const loadUserInfo = () => async (dispatch) => {
  try {
    if (!cookie.load('username', cookieOpt)) return;
    const res = await getJSON(`${api}/auth/info`);
    const user = await res.json();
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
      dispatch({ type: AuthConstants.LOGIN });
      const res = await postJSON(`${api}/auth/login`, {
        username,
        password,
      });
      const { token } = await res.json();
      toast('success', 'Login succeed', 'Welcome to NJU Online Judge');
      loginSuccess({ username, token });
      await dispatch(loadUserInfo());
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
  try {
    const state = getState();
    const { username, password, confirmPassword } = getValues(state.form.register) || {};
    const error = registerChecker(username, password, confirmPassword);
    if (error) {
      toast('warning', error);
    } else {
      nprogress.start();
      dispatch({ type: AuthConstants.REGISTER });
      const res = await postJSON(`${api}/auth/register`, {
        username,
        password,
        confirmPassword,
      });
      const { token } = await res.json();
      toast('success', 'Register succeed', 'Welcome to NJU Online Judge');
      loginSuccess({ username, token });
      await dispatch(loadUserInfo());
      nprogress.done();
      return true;
    }
  } catch (err) {
    toast('error', err.message);
    nprogress.done();
  }
  return false;
};
