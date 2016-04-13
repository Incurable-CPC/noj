/**
 * Created by cpc on 4/13/16.
 */

import TimeConstants from '../constants/TimeConstants';
import { getJSON } from '../core/fetchJSON';
import moment from 'moment';

let interval = null;
let diff = 0;

export const timeInit = () => async (dispatch) => {
  const res = await getJSON('/api/time');
  const { time } = await res.json();
  dispatch({
    type: TimeConstants.SET,
    time,
  });
  clearInterval(interval);
  diff = moment().diff(time);
  interval = setInterval(() => {
    dispatch({
      type: TimeConstants.SET,
      time: moment().subtract(diff).toJSON(),
    });
  }, 200);
};
