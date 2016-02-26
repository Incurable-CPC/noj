/**
 * Created by cpc on 2/26/16.
 */

import { Router } from 'express';
const router = new Router();

import { requireAuth } from './common';
import Submission from '../models/submissionModel';

const postSubmission = async (req, res, next) => {
  try {
    let { submission } = req.body;
    submission = new Submission(submission);
    await submission.save();

    res.send({ submission });
  } catch (err) {
    next(err);
  }
};

router.all('*', requireAuth);
router.post('/', postSubmission);

export default router;
