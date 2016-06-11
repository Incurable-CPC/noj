/**
 * Created by cpc on 1/30/16.
 */

import DialogConstants from '../constants/dialog';

const initState = 'empty';

export default function reducer(state = initState, action) {
  switch (action.type) {
    case DialogConstants.SHOW:
      return action.content;
    case DialogConstants.HIDE:
      return initState;
    default:
      return state;
  }
}
