/**
 * Created by cpc on 5/30/16.
 */

import UserConstants from '../constants/UserConstants';
import { fromJS } from 'immutable';

const initState = fromJS({});

export default function (state = initState, action) {
  switch (action.type) {
    case UserConstants.SET:
      return fromJS(action.user);
    default:
      return state;
  }
}
