/**
 * Created by cpc on 5/30/16.
 */

import UserConstants from '../constants/UserConstants';
import { fromJS, Iterable } from 'immutable';

const initState = fromJS({
  detail: {},
  condition: {},
  list: [],
});

export const updateUser = (user, updates) => {
  ['solved', 'tried'].forEach((field) =>
    user = user.update(field, _ => _.toSet()));
  if (updates) {
    updates.forEach((value, key) => {
      user = user.update(key, (_) =>
        Iterable.isIterable(_) ? _.concat(value) : value);
    });
  }
  let notSolved = user
    .get('tried')
    .filter((pid) => !user.get('solved').includes(pid));
  return user.set('notSolved', notSolved);
};

export default function (state = initState, action) {
  switch (action.type) {
    case UserConstants.SET:
      return state.set('detail', updateUser(fromJS(action.user)));
    case UserConstants.UPDATE:
      return state.update('detail', user =>
        updateUser(user, fromJS(action.updates)));
    case UserConstants.SET_LIST:
      return state.set('list', fromJS(action.userList))
        .set('condition', fromJS(action.condition))
        .set('count', action.count);
    default:
      return state;
  }
}
