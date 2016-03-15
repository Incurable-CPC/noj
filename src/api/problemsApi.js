/**
 * Created by cpc on 1/14/16.
 */

import { Router } from 'express';
const router = new Router();

import { requireAuth, requireAdmin } from './common';
import Problem from '../models/problemModel';
import { markWithMath } from '../common';
import fetch from '../core/fetch';

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
      .limit(50)
      .sort({ pid: 1 });
    res.send({ problemList });
  } catch (err) {
    next(err);
  }
};

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
      problem = await Problem.findOneAndUpdate({
        pid: problem.pid,
      }, problem, { upsert: true, new: true });
    } else {
      problem = new Problem(problem);
      problem = await problem.save();
    }

    res.send({ problem });
  } catch (err) {
    next(err);
  }
};

const getProblemFromPOJ = async () => {
  for (let id = 1000; id < 1050; id++) {
    const res = await fetch(`http://poj.org/problem?id=${id}`);
    const html = await res.text();
    const proRegex = {
      title: /<title>\d{3,} -- ([\s\S]*?)<\/title>/,
      description: /Description<\/p>([\s\S]*?)<p class="pst">/,
      input: />Input<\/p>([\s\S]*?)<p class="pst">/,
      output: />Output<\/p>([\s\S]*?)<p class="pst">/,
      sampleInput: /Sample Input<\/p><pre class="sio">([\s\S]*?)<\/pre><p class="pst">/,
      sampleOutput: /Sample Output<\/p><pre class="sio">([\s\S]*?)<\/pre><p class="pst">/,
      timeLimit: /Time Limit:<\/b> (\d+)MS/,
      memoryLimit: /Memory Limit:<\/b> (\d+)K/,
    };
    const handleUrl = (str) =>
      str.replace(/(src|href)="(.*?)"/, '$1="//poj.org/$2"');
    let problem = Object.keys(proRegex).reduce((pro, key) => {
      const match = html.match(proRegex[key]);
      if (match) pro[key] = handleUrl(match[1]);
      return pro;
    }, {});
    problem.samples = [{ input: problem.sampleInput, output: problem.sampleOutput }];
    problem.pid = `POJ${id}`;
    problem.originOJ = 'POJ';
    problem.originPid = id;
    problem = await Problem.findOneAndUpdate({
      pid: problem.pid,
    }, problem, { upsert: true, new: true });
    console.log(`${id - 999} / 200 done`);
  }
};

router.get('/', getProblemList);
router.get('/:pid', getProblem);

router.all('*', requireAuth);

router.all('*', requireAdmin);
router.post('/', postProblem);
router.post('/poj', getProblemFromPOJ);

export default router;
