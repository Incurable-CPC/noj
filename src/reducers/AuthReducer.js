/**
 * Created by cpc on 2/5/16.
 */

import cookie from 'react-cookie';
import { fromJS } from 'immutable';
import AuthConstants from '../constants/AuthConstants';

const username = cookie.load('username', { path: '/' });
const token = cookie.load('token', { path: '/' });
const initState = fromJS((username && token) ? {
  username,
  token,
} : {});

export default function reducer(state = initState, action) {
  switch (action.type) {
    case AuthConstants.LOGIN:
      return state.set('status', 'logging');
    case AuthConstants.REGISTER:
      return state.set('status', 'registering');
    case AuthConstants.LOGIN_SUCCESS:
      return fromJS(action.auth);
    case AuthConstants.LOGOUT_SUCCESS:
    case AuthConstants.FAILED:
      return fromJS({});
    default: return state;
  }
}
