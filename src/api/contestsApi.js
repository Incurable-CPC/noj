/**
 * Created by cpc on 3/28/16.
 */

import { Router } from 'express';
const router = new Router();

import { requireAuth, requireAdmin } from './common';
import Contest from '../models/contestModel';
import Problem from '../models/problemModel';
import checkSubmission from '../check/submission';

const checkManager = async (cid, username) => {
  const { manager } = await Contest.findOne({ cid });
  return (username !== manager) ?
    'Unauthorized opeartion' : '';
};

const getContest = async (req, res, next) => {
  try {
    const { params: { cid }, cookies: { username } } = req;
    const contest = await Contest.findOne({ cid });
    const isManager = contest.manager === username;
    const { problems } = contest;
    for (let i = 0; i < problems.length; i++) {
      let { pid } = problems[i];
      if (pid) {
        const { ratio, submit, accepted } = problems[i];
        problems[i] = await Problem.findOne({ pid });
        problems[i].submit = submit;
        problems[i].accepted = accepted;
        problems[i].ratio = ratio;
        if (!isManager) {
          problems[i].pid = null;
        }
      }
    }
    res.send({ contest });
  } catch (err) {
    next(err);
  }
};

const postContest = async (req, res, next) => {
  try {
    let {
      body: { contest },
      cookies: { username },
    } = req;
    const { cid } = contest;
    if (contest.cid) {
      const error = await checkManager(cid, username);
      if (error) {
        return res.status(401).send({ error });
      }
      contest = await Contest.findOneAndUpdate({ cid },
        contest, { upsert: true, new: true });
    } else {
      contest.manager = username;
      contest = new Contest(contest);
      contest = await contest.save();
    }
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

const postSubmission = async (req, res, next) => {
  try {
    const {
      body: {
        submission: { cid, pid, language, code },
      },
      cookies: { username },
    } = req;
    let submission = { username, cid, pid, language, code };
    const error = checkSubmission(submission);
    if (error) {
      return res.status(400).send({ error });
    }
    await Contest
      .findOneAndUpdate(
        { cid },
        { $push: { submissions: submission } });
    res.send({ submission });
  } catch (err) {
    next(err);
  }
};

router.get('/:cid', getContest);
router.get('/', getContestList);

router.all('*', requireAuth);
router.post('/', postContest);
router.post('/:cid/submissions', postSubmission);
export default router;
