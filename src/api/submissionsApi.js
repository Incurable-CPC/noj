/**
 * Created by cpc on 2/26/16.
 */

import { Router } from 'express';
const router = new Router();

import { requireAuth } from './common';
import Submission from '../models/submissionModel';

const getSubmissionList = async (req, res, next) => {
  try {
    const { pid } = req.query;
    const cond = {};
    if (pid) cond.pid = pid;
    const submissionList = await Submission.find(cond).
      select('-code').
      sort({ sid: -1 });
    res.send(submissionList);
  } catch (err) {
    next(err);
  }
};

const getSubmission = async (req, res, next) => {
  try {
    const { params: { sid }, query: { auth } } = req;
    const submission = await Submission.findOne({ sid });
    if (auth.username !== submission.username) {
      return res.status(401).send({ error: 'Unauthorized opeartion' });
    }

    res.send(submission);
  } catch (err) {
    next(err);
  }
};

const postSubmission = async (req, res, next) => {
  try {
    const {
      submission: { pid, language, code },
      auth: { username },
      } = req.body;
    const submission = new Submission({ username, pid, language, code });
    await submission.save();

    res.send({ submission });
  } catch (err) {
    next(err);
  }
};

router.get('/', getSubmissionList);

router.all('*', requireAuth);
router.get('/:sid', getSubmission);
router.post('/', postSubmission);

export default router;
