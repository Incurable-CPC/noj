/**
 * Created by cpc on 3/27/16.
 */


import { getJSON, postJSON } from '../core/fetchJSON';
import toast from '../core/toast';
import nprogress from '../core/nprogress';
import Location from '../core/Location';
import checkContest from '../check/contest';

export const postContest = async (contest, dispatch) => {
  try {
    const error = checkContest(contest);
    if (error) {
      toast('warning', error);
      return;
    }

    nprogress.start();
    const action = contest.cid ? 'saved' : 'added';
    const res = await postJSON('/api/contests', { contest });
    const data = await res.json();
    // dispatch(setProblem(data.problem));
    toast('success', `Contest ${action}`);
    // Location.push(`/contest/${data.contest.cid}`);
    Location.push('/');
  } catch (err) {
    toast('error', err.message);
  }

  await nprogress.done();
};
