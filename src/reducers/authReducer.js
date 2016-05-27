/**
 * Created by cpc on 2/5/16.
 */

import { fromJS } from 'immutable';
import AuthConstants from '../constants/AuthConstants';

const initState = fromJS({});

export default function reducer(state = initState, action) {
  switch (action.type) {
    case AuthConstants.LOGIN:
      return state.set('status', 'logging');
    case AuthConstants.REGISTER:
      return state.set('status', 'registering');
    case AuthConstants.SET:
      const user = fromJS(action.user);
      const notSolved = user
        .get('tried')
        .filter((pid) => !user.get('solved').includes(pid));
      return user.set('notSolved', notSolved);
    case AuthConstants.CLEAR:
      return fromJS({});
    default: return state;
  }
}
