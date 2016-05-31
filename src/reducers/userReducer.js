/**
 * Created by cpc on 5/30/16.
 */

import UserConstants from '../constants/UserConstants';
import { fromJS, List, Set } from 'immutable';

const initState = fromJS({
  detail: {},
  list: [],
});

export const updateUser = (user, updates) => {
  if (updates) {
    updates.forEach((value, key) => {
      user = user.update(key, (_) =>
        List.isList(_) ?
          _.concat(value) : value);
    });
  }
  let notSolved = user
    .get('tried')
    .filter((pid) => !user.get('solved').includes(pid));
  user = user.set('followers', new Set());
  user = user.set('following', new Set());
  user.get('followLogs').forEach((log) => {
    const field = log.get('target') ? 'following' : 'followers';
    const method = log.get('follow') ? 'add' : 'remove';
    user = user.update(field,
      (s = new Set()) => s[method](log.get('username')));
  });
  return user.set('notSolved', notSolved);
};

export default function (state = initState, action) {
  switch (action.type) {
    case UserConstants.SET:
      return state.set('detail', updateUser(fromJS(action.user)));
    case UserConstants.UPDATE:
      return state.update('detail', user =>
        updateUser(user, fromJS(action.updates)));
    default:
      return state;
  }
}
