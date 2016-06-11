/**
 * Created by cpc on 2/26/16.
 */

import mongoose, { Schema } from 'mongoose';
import Counter from './Counter';

export const submissionSchema = {
  code: String,
  language: { type: Number, default: 0 },
  username: { type: String, index: true },
  result: { type: Number, default: 0 },
  pid: { type: String, index: true },
  date: { type: Date, default: Date.now },
  codeLength: Number,
  timeUsage: Number,
  memoryUsage: Number,
  originOJ: String,
  originPid: String,
  CEInfo: String,
};

const schema = new Schema(Object.assign({
  sid: { type: Number, index: { unique: true } },
}, submissionSchema));

schema.pre('save', async function getSid(next) {
  this.codeLength = this.code.length;
  if (this.sid) return next();
  const solCounter = await Counter.add('Submission');
  this.sid = solCounter + 100000;
  next();
});

const Submission = mongoose.model('Submission', schema);
export default Submission;

export function submissionCheckUser(sub, username) {
  if (sub.username !== username) {
    sub.code = undefined;
  }
}

export function submissionListCheckUser(subList, username) {
  subList.forEach((sub) => submissionCheckUser(sub, username));
}
