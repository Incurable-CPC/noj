/**
 * Created by cpc on 3/26/16.
 */

import { Model, pre } from 'mongoose-babelmodel';
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
  questions: [{
    username: String,
    question: String,
    answer: String,
  }],
};

class Contest extends Model {
  _schema = contestSchema;

  @pre('save')
  static async getCid(next) {
    if (this.cid) return next();
    const contestCounter = await Counter.add('Contest');
    this.cid = contestCounter + 10000;
    next();
  }
}

const contest = new Contest();
export default contest.generateModel();
