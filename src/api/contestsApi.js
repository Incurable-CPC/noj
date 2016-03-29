/**
 * Created by cpc on 3/28/16.
 */

import { Router } from 'express';
const router = new Router();

import { requireAuth, requireAdmin } from './common';
import Contest from '../models/contestModel';

const postContest = async (req, res, next) => {
  try {
    const {
      body: {
        contest: { title, start, duration },
      },
      cookies: { username },
    } = req;
    let contest = new Contest({
      title, start, duration,
      manger: username,
    });
    contest = await contest.save();
    res.send({ contest });
  } catch (err) {
    next(err);
  }
};

const NUM_PEER_PAGE = 25;
const getContestList = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const order = Number(req.query.order) || -1;
    const sortKey = req.query.sortKey || 'cid';
    const { searchKey } = req.query;
    const condition = {};
    if (searchKey) {
      condition.title = {
        $regex: searchKey,
        $options: 'i',
      };
    }

    const contestList = await Contest.find(condition)
      .select('cid title start duration')
      .sort({ [sortKey]: order })
      .skip((page - 1) * NUM_PEER_PAGE)
      .limit(NUM_PEER_PAGE);
    const count = Math.ceil((await Contest.find(condition).count()) / NUM_PEER_PAGE);
    res.send({
      count,
      contestList,
    });
  } catch (err) {
    next(err);
  }
};

router.get('/', getContestList);

router.all('*', requireAuth);
router.post('/', postContest);
export default router;
