/**
 * Created by cpc on 1/10/16.
 */

import fetch from './fetch';
import store from '../stores';
import { logout } from '../actions/authActions';

const handleError = async (res) => {
  if (res.ok) return await res.json();
  if (res.status === 401) {
    store.dispatch(logout({ quiet: true }));
  }
  const { error } = await res.json();
  throw new Error(error);
};

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

export const postJSON = async (url, data = {}) => {
  await sleep();
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  };
  options.body = JSON.stringify(data);

  const res = await fetch(url, options);
  return handleError(res);
};

const serialize = (data, prefix) => {
  const str = [];
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value) {
      const newPrefix = prefix ? `${prefix}[${key}]` : key;
      str.push(typeof value !== 'object' ?
        `${encodeURIComponent(newPrefix)}=${encodeURIComponent(value)}`
        : serialize(value, newPrefix));
    }
  });
  return str.join('&');
};

export const getJSON = async (url, data = {}) => {
  await sleep();
  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  };

  const res = await fetch(`${url}?${serialize(data)}`, options);
  return handleError(res);
};
