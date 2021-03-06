/**
 * Created by cpc on 2/26/16.
 */

import { Router } from 'express';
const router = new Router();

import { requireAuth, requireAdmin, getUsername, handleError } from './common';
import Submission from '../models/Submission';
import Problem from '../models/Problem';
import User from '../models/User';
import { RESULT_VALUES } from '../constants';
import submissionChecker, { isCompleted, isAccepted } from '../check/submission';

const checkSubmission = async (submission) => submissionChecker(submission);

const getSubmissionList = handleError(async (req, res) => {
  const { pid } = req.query;
  const cond = {};
  if (pid) cond.pid = pid;
  const submissionList = await Submission.find(cond).
  select('-code').
  sort({ sid: -1 });
  res.send({ submissionList });
});

const getSubmission = handleError(async (req, res) => {
  const { sid } = req.params;
  const username = getUsername(req);
  let submission = await Submission
    .findOne({ sid });
  if (username !== submission.username) {
    submission.code = null;
  }
  res.send({ submission });
});

const postSubmission = handleError(async (req, res) => {
  const {
    submission: { pid, language, code },
  } = req.body;
  const username = getUsername(req);
  let submission = new Submission({ username, pid, language, code });
  const error = await checkSubmission(submission);
  if (error) return res.status(406).send({ error });
  const problem = await Problem
    .findOne({ pid })
    .select('originOJ originPid');
  submission.originOJ = problem.originOJ;
  submission.originPid = problem.originPid;
  await submission.save();
  submission = await submission.save();
  await Problem.findOneAndUpdate(
    { pid },
    { $inc: { submit: 1 } });
  await Problem.updateRatio(pid);
  await User.findOneAndUpdate(
    { username }, {
      $set: { lastSubmit: submission.date },
      $addToSet: { tried: pid },
    });
  res.send({ submission });
});

const getUnjudgedSubmission = handleError(async (req, res) => {
  const submission = await Submission
    .findOneAndUpdate(
      { result: 0 },
      { $set: { result: RESULT_VALUES.RI } },
    ).sort({ sid: 1 });
  if (submission) {
    res.send({ submission });
  } else {
    res.send({});
  }
});

const updateSubmissionResult = handleError(async (req, res) => {
  const { sid } = req.params;
  let submission = await Submission.findOne({ sid });
  if (isCompleted(submission.result)) {
    return res.send({ submission });
  }

  submission = await Submission.findOneAndUpdate(
    { sid },
    req.body.submission,
    { new: true });
  if (isAccepted(submission.result)) {
    const { username, pid } = submission;
    await Problem.findOneAndUpdate(
      { pid },
      { $inc: { accepted: 1 } });
    await Problem.updateRatio(pid);
    await User.findOneAndUpdate(
      { username },
      { $addToSet: { solved: pid } });
  }

  res.send({ submission });
});

router.get('/', getSubmissionList);
router.get('/:sid', getSubmission);

router.all('*', requireAuth);
router.post('/', postSubmission);

router.all('*', requireAdmin);
router.post('/unjudged', getUnjudgedSubmission);
router.patch('/:sid', updateSubmissionResult);

export default router;
