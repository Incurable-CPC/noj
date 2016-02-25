/**
 * Created by cpc on 2/25/16.
 */

import nprogress from 'nprogress';

let cnt = 0;

export default {
  start() {
    if (cnt === 0) nprogress.start();
    cnt++;
  },

  done() {
    cnt--;
    if (cnt === 0) nprogress.done();
  },
};
