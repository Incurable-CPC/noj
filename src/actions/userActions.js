/**
 * Created by cpc on 5/30/16.
 */

import UserConstants from '../constants/UserConstants';
import { getJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import toast from '../core/toast';
import { api } from '../config';

const setUserInfo = (user) => ({
  type: UserConstants.SET,
  user,
});

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
