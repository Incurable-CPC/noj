/**
 * Created by cpc on 4/13/16.
 */
import TimeConstants from '../constants/TimeConstants';

export default function (state = '', action) {
  switch (action.type) {
    case TimeConstants.SET:
      return action.time;
    default:
      return state;
  }
}
