/**
 * Created by cpc on 1/17/16.
 */

import { Model, pre } from 'mongoose-babelmodel';
import Counter from './counterModel';

class Problem extends Model {
  pid = { type: String, index: { unique: true } };
  title = String;
  timeLimit = { type: Number, default: 1000 };
  memoryLimit = { type: Number, default: 256 };
  descriptionSrc = String;
  description = String;
  inputSrc = String;
  input = String;
  outputSrc = String;
  output = String;
  samples = [{ input: String, output: String }];
  sourceSrc = String;
  source = String;
  hintSrc = String;
  hint = String;
  testdataNum = Number;
  submit = { type: Number, default: 0 };
  accepted = { type: Number, default: 0 };
  specialJudge = Boolean;

  @pre('save')
  static async getPid(next) {
    if (this.pid) return next();
    const proCount = await Counter.add('Problem');
    this.pid = proCount + 1000;
    next();
  }
}

const problem = new Problem();
export default problem.generateModel();
