/**
 * Created by cpc on 1/17/16.
 */

import mongoose, { Schema } from 'mongoose';
import Counter from './Counter';

export const problemSchema = {
  title: String,
  timeLimitNum: { type: Number, default: 1000 },
  memoryLimitNum: { type: Number, default: 256 },
  timeLimit: String,
  memoryLimit: String,
  descriptionSrc: String,
  description: String,
  inputSrc: String,
  input: String,
  outputSrc: String,
  output: String,
  samples: [{ input: String, output: String }],
  sourceSrc: String,
  source: String,
  hintSrc: String,
  hint: String,
  testdataNum: Number,
  ratio: { type: Number, default: 0 },
  submit: { type: Number, default: 0 },
  accepted: { type: Number, default: 0 },
  specialJudge: Boolean,
  originOJ: { type: String, default: 'local' },
  originPid: String,
};

const schema = new Schema(Object.assign({
  pid: { type: String, index: { unique: true } },
}, problemSchema));


schema.statics.updateRatio = async function updateRatio(pid) {
  const problem = await this.findOne({ pid });
  const { submit, accepted } = problem;
  problem.ratio = (submit > 0) ? (100 * accepted / submit) : 0;
  await problem.save();
};

schema.pre('save', async function getPid(next) {
  if (this.pid) return next();
  const proCount = await Counter.add('Problem');
  this.pid = proCount + 1000;
  next();
});

const Problem = mongoose.model('Problem', schema);
export default Problem;
