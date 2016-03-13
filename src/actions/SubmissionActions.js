/**
 * Created by cpc on 2/27/16.
 */

import toast from '../core/toast';
import { postJSON } from '../core/fetchJSON';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import checkSubmission from '../check/submission';

export const submit = async (submission) => {
  try {
    const { pid } = submission;
    const error = checkSubmission(submission);
    if (error) {
      toast('warning', error);
      return false;
    }

    nprogress.start();
    await postJSON('/api/submissions', { submission });
    toast('success', 'Submit succeed');
    await nprogress.done();
    Location.push(`/problems/${pid}/status`);
    return true;
  } catch (err) {
    console.log(err);
    toast('error', err.message);
    await nprogress.done();
    return false;
  }
};
