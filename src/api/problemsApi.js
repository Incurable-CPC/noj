/**
 * Created by cpc on 1/14/16.
 */

import { Router } from 'express';
const router = new Router();

import { requireAuth, requireAdmin } from './common';
import Problem from '../models/problemModel';
import { markWithMath } from '../common';

const srcFields = ['description', 'input', 'output', 'source', 'hint'];
const postProblem = async (req, res, next) => {
  try {
    let { problem } = req.body;
    srcFields.forEach((field) => {
      const src = problem[`${field}Src`];
      if (src) {
        problem[field] = markWithMath(src);
      }
    });
    if (problem.pid) {
      await Problem.findOneAndUpdate({
        pid: problem.pid,
      }, problem);
    } else {
      problem = new Problem(problem);
      await problem.save();
    }

    res.send({ problem });
  } catch (err) {
    next(err);
  }
};

const getProblem = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const problem = await Problem.findOne({ pid });
    if (problem) {
      res.send({ problem });
    } else {
      res.status(404).send({ error: 'Problem not exist' });
    }
  } catch (err) {
    next(err);
  }
};

const getProblemList = async (req, res, next) => {
  try {
    const problemList = await Problem.find({})
      .select('pid title accepted submit')
      .sort({ pid: 1 });
    res.send({ problemList });
  } catch (err) {
    next(err);
  }
};

router.get('/', getProblemList);
router.get('/:pid', getProblem);

router.all('*', requireAuth);

router.all('*', requireAdmin);
router.post('/', postProblem);

export default router;
