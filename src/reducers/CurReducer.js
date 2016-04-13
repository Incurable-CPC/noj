/**
 * Created by cpc on 4/13/16.
 */
import CurConstants from '../constants/CurConstants';
import moment from 'moment';

export default function (state = new Date(), action) {
  switch (action.type) {
    case CurConstants.INIT:
      return action.cur;
    case CurConstants.INCREASE:
      return moment(state)
        .add(moment.duration(action.duration))
        .toDate();
    default:
      return state;
  }
}
