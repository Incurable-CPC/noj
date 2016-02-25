/**
 * Created by cpc on 1/10/16.
 */

import fetch from './fetch';
import store from '../stores';
import { logoutSuccess } from '../actions/AuthActions';

const handleError = async (res) => {
  if (res.ok) {
    return res;
  }

  if (res.status === 401) {
    store.dispatch(logoutSuccess());
  }

  throw new Error((await res.json()).error);
};

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export const postJSON = async (url, data = {}) => {
  await sleep(2000);
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const state = store.getState();
  const auth = state.auth;
  if (auth.has('username')) data.auth = auth.toJS();
  options.body = JSON.stringify(data);

  const res = await fetch(url, options);
  return handleError(res);
};

export const getJSON = async (url) => {
  await sleep(2000);
  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = await fetch(url, options);
  return handleError(res);
};
