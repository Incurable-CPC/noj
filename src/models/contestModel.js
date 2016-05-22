/**
 * Created by cpc on 3/26/16.
 */

import mongoose, { Schema } from 'mongoose';
import Counter from './counterModel';
import { problemSchema } from './problemModel';
import { submissionSchema } from './submissionModel';

export const contestSchema = {
  cid: { type: Number, index: { unique: true } },
  title: String,
  start: { type: Date, default: Date.now },
  duration: Number,
  manager: String,
  problems: [Object.assign({ pid: String }, problemSchema)],
  submissions: [submissionSchema],
  questionCnt: { type: Number, default: 0 },
  clarifyLogs: [{
    kind: Number,
    qid: Number,
    username: String,
    content: String,
    time: { type: Date, default: Date.now },
  }],
};

const schema = new Schema(contestSchema);
schema.pre('save', async function getCid(next) {
  if (this.cid) return next();
  const contestCounter = await Counter.add('Contest');
  this.cid = contestCounter + 10000;
  next();
});

const Contest = mongoose.model('Contest', schema);
export default Contest;
