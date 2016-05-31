/**
 * Created by cpc on 5/30/16.
 */

import UserConstants from '../constants/UserConstants';
import { fromJS, List } from 'immutable';

const initState = fromJS({});

export const updateUser = (user, updates) => {
  if (updates) {
    updates.forEach((value, key) => {
      user = user.update(key, (_) =>
        List.isList(_) ?
          _.concat(value) : value);
    });
  }
  const notSolved = user
    .get('tried')
    .filter((pid) => !user.get('solved').includes(pid));
  return user.set('notSolved', notSolved);
};

export default function (state = initState, action) {
  switch (action.type) {
    case UserConstants.SET:
      return fromJS(action.user);
    case UserConstants.UPDATE:
      return updateUser(state, action.updates);
    default:
      return state;
  }
}
