/**
 * Created by cpc on 5/23/16.
 */

import { checkEmpty } from './index';

const ERROR_MSG = [
  'Please input username',
  'Please input password',
  'Passwords not match',
  'Username can only contain letters numbers and underscores',
  'Username must be between 3 and 12 characters long',
  'Please input old password',
];
export const loginChecker = (username, password) => {
  if (checkEmpty(username)) return ERROR_MSG[0];
  if (!password) return ERROR_MSG[1];
  return '';
};

export const registerChecker = (username, password, confirmPassword) => {
  if (checkEmpty(username)) return ERROR_MSG[0];
  if (!password) return ERROR_MSG[1];
  if (password !== confirmPassword) return ERROR_MSG[2];
  const error = usernameChecker(username);
  if (error) return error;
  return '';
};

export const usernameChecker = (username) => {
  if (!username) return '';
  if (!/^[_a-zA-Z0-9]*$/.test(username)) return ERROR_MSG[3];
  const { length } = username;
  if ((length < 3) || (length > 12)) return ERROR_MSG[4];
  return '';
};

export const passwordsChecker = (oldPassword, password, confirmPassword) => {
  if (!oldPassword) return ERROR_MSG[5];
  return registerChecker('aaa', password, confirmPassword);
};
