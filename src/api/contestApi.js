/**
 * Created by cpc on 3/28/16.
 */

import { Router } from 'express';
import moment from 'moment';
const router = new Router();

import { requireAuth, requireAdmin } from './common';
import Contest from '../models/contestModel';

const postContest = async (req, res, next) => {
  try {
    const {
      body : {
        contest: { title, start, length },
      },
      cookies: { username },
    } = req;
    const end = moment(start).add(length, 'hour').toDate();
    let contest = new Contest({
      title, start, end,
      manger: username,
    });
    contest = await contest.save();
    res.send({ contest });
  } catch (err) {
    next(err);
  }
};

router.all('*', requireAuth);
router.post('/', postContest);
export default router;
