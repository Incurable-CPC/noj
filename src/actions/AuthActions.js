/**
 * Created by cpc on 1/7/16.
 */

import { getValues } from 'redux-form';
import cookie from 'react-cookie';
import AuthConstants from '../constants/AuthConstants';
import { postJSON } from '../core/fetchJSON';
import toast from '../core/toast';
import nprogress from 'nprogress';

const cookieOpt = {
  maxAge: 9000000,
};

export const loginSuccess = (auth) => {
  const { username, token } = auth;
  cookie.save('username', username, cookieOpt);
  cookie.save('token', token, cookieOpt);
  return {
    type: AuthConstants.LOGIN_SUCCESS,
    auth,
  };
};

export const logoutSuccess = () => {
  cookie.remove('username');
  cookie.remove('token');
  return {
    type: AuthConstants.LOGOUT_SUCCESS,
  };
};

export const authFailed = () => ({
  type: AuthConstants.FAILED,
});

export const login = () => async(dispatch, getState) => {
  try {
    nprogress.start();
    dispatch({ type: AuthConstants.LOGIN });
    const state = getState();
    const { username, password } = getValues(state.form.login) || {};
    if (!username) {
      toast('warning', 'Please input username');
    } else if (!password) {
      toast('warning', 'Please input password');
    } else {
      const res = await postJSON('/api/auth/login', {
        username,
        password,
      });
      const { token } = await res.json();
      toast('success', 'Login succeed', 'Welcome to NJU Online Judge !');
      dispatch(loginSuccess({ username, token }));
      nprogress.done();
      return true;
    }
  } catch (err) {
    toast('error', err.message);
  }

  nprogress.done();
  dispatch(authFailed());
  return false;
};

export const logout = () => async(dispatch) => {
  try {
    nprogress.start();
    await postJSON('/api/auth/logout');
    toast('success', 'Logout succeed');
    dispatch(logoutSuccess());
    nprogress.done();
  } catch (err) {
    toast('error', err.message);
    nprogress.done();
  }
};

export const register = () => async(dispatch, getState) => {
  try {
    const state = getState();
    nprogress.start();
    dispatch({ type: AuthConstants.REGISTER });
    const { username, password, confirmPassword } = getValues(state.form.register) || {};
    if (!username) {
      toast('warning', 'Please input username');
    } else if (!password) {
      toast('warning', 'Please input password');
    } else if (password !== confirmPassword) {
      toast('warning', 'Passwords not match');
    } else {
      const res = await postJSON('/api/auth/register', {
        username,
        password,
      });
      const { token } = await res.json();
      toast('success', 'Register succeed', 'Welcome to NJU Online Judge !');
      dispatch(loginSuccess({ username, token }));
      nprogress.done();
      return true;
    }
  } catch (err) {
    toast('error', err.message);
  }

  nprogress.done();
  dispatch(authFailed());
};
