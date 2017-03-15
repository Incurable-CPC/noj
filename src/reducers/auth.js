/**
 * Created by cpc on 2/5/16.
 */

import { fromJS } from 'immutable';
import AuthConstants from '../constants/auth';
import { updateUser } from './user';

const initState = fromJS({});

export default function reducer(state = initState, action) {
  switch (action.type) {
    case AuthConstants.SET:
      return updateUser(fromJS(action.user));
    case AuthConstants.CLEAR:
      return fromJS({});
    case AuthConstants.UPDATE:
      return updateUser(state, fromJS(action.updates));
    default: return state;
  }
}
