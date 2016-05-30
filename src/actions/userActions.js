/**
 * Created by cpc on 5/30/16.
 */

import UserConstants from '../constants/UserConstants';
import { getJSON } from '../core/fetchJSON';
import toast from '../core/toast';
import { api } from '../config';

const setUserInfo = (user) => ({
  type: UserConstants.SET,
  user,
});

export const loadUserInfo = (username) => async (dispatch) => {
  try {
    const user = await getJSON(`${api}/users/${username}`);
    dispatch(setUserInfo(user));
  } catch (err) {
    toast('error', err.message);
  }
};
