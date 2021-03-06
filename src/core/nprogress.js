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
    if (cnt > 0) {
      cnt--;
      if (cnt === 0) nprogress.done();
    }

    return new Promise((resolve) => setTimeout(resolve, 80));
  },
};
