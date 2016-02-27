/**
 * Created by cpc on 2/26/16.
 */

import { Router } from 'express';
const router = new Router();

import { requireAuth } from './common';
import Submission from '../models/submissionModel';

const postSubmission = async (req, res, next) => {
  try {
    const {
      submission: { pid, language, code },
      auth: { username },
      } = req.body;
    const submission = new Submission({ username, pid, language, code });
    console.log(submission);
    await submission.save();

    res.send({ submission });
  } catch (err) {
    next(err);
  }
};

router.all('*', requireAuth);
router.post('/', postSubmission);

export default router;
