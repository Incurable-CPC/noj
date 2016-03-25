/**
 * Created by cpc on 2/5/16.
 */

import cookie from 'react-cookie';
import { fromJS } from 'immutable';
import AuthConstants from '../constants/AuthConstants';

const initState = fromJS({});

export default function reducer(state = initState, action) {
  const { type, user } = action;
  switch (type) {
    case AuthConstants.LOGIN:
      return state.set('status', 'logging');
    case AuthConstants.REGISTER:
      return state.set('status', 'registering');
    case AuthConstants.SET:
      return fromJS(user);
    case AuthConstants.CLEAR:
      return fromJS({});
    default: return state;
  }
}
