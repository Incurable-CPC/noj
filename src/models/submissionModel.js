/**
 * Created by cpc on 2/26/16.
 */

import { Model, pre } from 'mongoose-babelmodel';
import Counter from './counterModel';

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

class Submission extends Model {
  _schema = Object.assign({
    sid: { type: Number, index: { unique: true } },
  }, submissionSchema);

  @pre('save')
  static async getSid(next) {
    this.codeLength = this.code.length;
    if (this.sid) return next();
    const solCounter = await Counter.add('Submission');
    this.sid = solCounter + 100000;
    next();
  }
}

const submission = new Submission();
export default submission.generateModel();

export function submissionCheckUser(sub, username) {
  if (sub.username !== username) {
    sub.code = undefined;
  }
}

export function submissionListCheckUser(subList, username) {
  subList.forEach((sub) => submissionCheckUser(sub, username));
}
