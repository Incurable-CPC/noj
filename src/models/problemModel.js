/**
 * Created by cpc on 1/17/16.
 */

import { Model, pre } from 'mongoose-babelmodel';
import Counter from './counterModel';

export const problemSchema = {
  title: String,
  timeLimit: { type: Number, default: 1000 },
  memoryLimit: { type: Number, default: 256 },
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

class Problem extends Model {
  _schema = Object.assign({
    pid: { type: String, index: { unique: true } },
  }, problemSchema);

  @pre('save')
  static async getPid(next) {
    if (this.pid) return next();
    const proCount = await Counter.add('Problem');
    this.pid = proCount + 1000;
    next();
  }

  static async updateRatio(pid) {
    const problem = await this.findOne({ pid });
    const { submit, accepted } = problem;
    problem.ratio = (submit > 0) ? (100 * accepted / submit) : 0;
    await problem.save();
  }
}

const problem = new Problem();
export default problem.generateModel();
