/**
 * Created by cpc on 2/27/16.
 */

import toast from '../core/toast';
import { postJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';

export const submit = async (submission) => {
  try {
    const code = submission.code;
    if (!(code && code.trim())) {
      toast('warning', 'Please input your source code');
      return;
    }

    nprogress.start();
    await postJSON('/api/submissions', { submission });
    toast('success', 'Submit succeed');
  } catch (err) {
    toast('error', err.message);
  }

  nprogress.done();
};
