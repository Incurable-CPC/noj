/**
 * Created by cpc on 4/13/16.
 */

import CurConstants from '../constants/CurConstants';
import { getJSON } from '../core/fetchJSON';

let interval;

export const timeInit = () => async (dispatch) => {
  const res = await getJSON('/api/cur');
  const { cur } = await res.json();
  dispatch({
    type: CurConstants.INIT,
    cur,
  });
  clearInterval(interval);
  const duration = 200;
  interval = setInterval(() => {
    dispatch({
      type: CurConstants.INCREASE,
      duration,
    });
  }, duration);
};
