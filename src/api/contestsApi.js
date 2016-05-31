/**
 * Created by cpc on 3/28/16.
 */

import { Router } from 'express';
const router = new Router();
import moment from 'moment';

import { requireAuth, requireAdmin, getUsername, setListSkip } from './common';
import Contest from '../models/contestModel';
import Problem from '../models/problemModel';
import { submissionCheckUser, submissionListCheckUser } from '../models/submissionModel';
import submissionChecker from '../check/submissionChecker';

import contestChecker, { problemNotExist } from '../check/contestChekcer';
const checkContest = async (contest) => {
  let error = contestChecker(contest);
  if (error) return error;
  const { problems } = contest;
  for (let i = 0; i < problems.length; i++) {
    const { pid } = problems[i];
    const problem = await Problem.findOne({ pid });
    if (!problem) return problemNotExist(pid, i);
  }
  return '';
};

const checkStarted = async (cid) => {
  const { start } = await Contest
    .findOne({ cid })
    .select('start');
  const now = moment();
  return now.isAfter(start);
};

const checkSubmission = async (submission) => {
  let error = submissionChecker(submission);
  if (error) return error;
  const { cid } = submission;
  const { start, duration } = await Contest
    .findOne({ cid })
    .select('start duration');
  const now = moment();
  const end = moment(start).add(duration, 'hours');
  if (now.isAfter(end) || now.isBefore(start)) return 'Out of contest time';
};

const checkManager = async (cid, username) => {
  const { manager } = (await Contest
    .findOne({ cid })
    .selec('manager')) || {};
  return (username !== manager) ?
    'Unauthorized opeartion' : '';
};

const checkCid = async (req, res, next) => {
  const { cid } = req.params;
  const contest = await Contest
    .findOne({ cid })
    .select('cid');
  if (contest) next();
  else res.status(404).send({ error: 'Contest not exist' });
};

const getContest = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const username = getUsername(req);
    const contest = await Contest.findOne({ cid });
    const isManager = contest.manager === username;
    if ((await checkStarted(cid)) || isManager) {
      const { problems, submissions } = contest;
      for (let i = 0; i < problems.length; i++) {
        let { pid } = problems[i];
        problems[i] = await Problem.findOne({ pid });
        if (!isManager) problems[i].pid = undefined;
      }
      submissionListCheckUser(submissions, username);
    } else {
      contest.problems = [];
      contest.submissions = [];
      contest.clarifyLogs = [];
    }
    res.send({ contest });
  } catch (err) {
    next(err);
  }
};

const getcontestUpdate = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const username = getUsername(req);
    const query = Contest.findOne({ cid })
      .select('submissions clarifyLogs');
    ['submission', 'clarifyLog'].forEach(setListSkip(req, query));
    const { submissions, clarifyLogs } = await query;
    submissionListCheckUser(submissions, username);
    res.send({
      submissionList: submissions,
      clarifyLogList: clarifyLogs,
    });
  } catch (err) {
    next(err);
  }
};

const postContest = async (req, res, next) => {
  try {
    const username = getUsername(req);
    let { contest } = req.body;
    let error = await checkContest(contest);
    if (error) return res.status(406).send({ error });
    const { cid } = contest;
    if (contest.cid) {
      error = await checkManager(cid, username);
      if (error) return res.status(401).send({ error });
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
      submission: { cid, pid, language, code },
    } = req.body;
    const username = getUsername(req);
    let submission = { username, cid, pid, language, code };
    const error = await checkSubmission(submission);
    if (error) return res.status(406).send({ error });
    const index = pid.charCodeAt(0) - 'A'.charCodeAt(0);
    const contest = await Contest.findOne({ cid });
    const problem = await Problem
      .findOne({ pid: contest.problems[index].pid })
      .select('originOJ originPid');
    submission.originOJ = problem.originOJ;
    submission.originPid = problem.originPid;
    await Contest
      .findOneAndUpdate(
        { cid },
        { $push: { submissions: submission } });
    res.send({ submission });
  } catch (err) {
    next(err);
  }
};

const getSubmission = async (req, res, next) => {
  try {
    const { cid, sid } = req.params;
    const username = getUsername(req);
    let submission = await Contest
      .findOne({ cid })
      .select(`submissions.${sid}`);
    submissionCheckUser(submission, username);
    res.send({ submission });
  } catch (err) {
    next(err);
  }
};

const clarifyContest = async (req, res, next) => {
  try {
    let {
      params: { cid },
      body: { content, qid },
    } = req;
    const username = getUsername(req);
    let kind = 1;
    if (Number(qid) < 0) {
      const { questionCnt } = await Contest
        .findOneAndUpdate(
          { cid },
          { $inc: { questionCnt: 1 } })
        .select('questionCnt');
      qid = questionCnt;
      kind = 0;
    }
    const newLog = { kind, qid, content, username };
    const { clarifyLogs } = await Contest
      .findOneAndUpdate(
        { cid },
        { $push: { clarifyLogs: newLog } },
        { new: true })
      .select('clarifyLogs')
      .slice('clarifyLogs', -1);
    res.send({ clarifyLog: clarifyLogs[0] });
  } catch (err) {
    next(err);
  }
};

const generateTest = async (req, res) => {
  const contest = await Contest.findOne({ cid: 10000 });
  const rand = (n) => Math.floor(Math.random() * n);
  const randChar = () => String.fromCharCode('A'.charCodeAt(0) + rand(26));
  const proCnt = contest.problems.length;
  const diff = contest.problems.map(() => [1, 30, 70, 500][rand(4)]);
  const solved = {};
  for (let i = 0; i < 400; i++) {
    const username = randChar();
    let index = 0;
    if (!solved[username]) solved[username] = {};
    const t = solved[username];
    while ((index < proCnt) && (t[index])) index ++;
    if (index === proCnt) continue;
    for (let k = index + 1; k < proCnt; k++) {
      if ((!t[k]) && ((diff[k] > diff[index])
        || ((diff[k] === diff[index]) && (Math.random() < 0.5)))) index = k;
    }
    const pid = String.fromCharCode('A'.charCodeAt(0) + index);
    const val = Math.random() * 1000 / 26 * (1 + username.charCodeAt(0) - 'A'.charCodeAt(0));
    let result = 6;
    if (val < diff[index]) {
      result = 4;
      t[index] = 1;
    }
    const date = new Date();
    date.setTime(contest.start.getTime() + i * 60000);
    const originOJ = 'POJ';
    const submission = { username, result, date, pid, originOJ };
    contest.submissions.push(submission);
  }
  await contest.save();
  res.send(contest);
};

router.get('/', getContestList);
router.all('/:cid', checkCid);
router.get('/:cid', getContest);
router.get('/:cid/update', getcontestUpdate);
router.get('/:cid/submissions/:sid', getSubmission);

router.all('*', requireAuth);
router.post('/', postContest);
router.post('/:cid/submissions', postSubmission);
router.post('/:cid/clarification', clarifyContest);
router.get('/temp', generateTest);
export default router;
