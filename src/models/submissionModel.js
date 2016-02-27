/**
 * Created by cpc on 2/26/16.
 */

import { Model, pre } from 'mongoose-babelmodel';
import Counter from './counterModel';

class Submission extends Model {
  sid = { type: Number, index: { unique: true } };
  code = String;
  language = { type: Number, default: 0 };
  username = { type: String, index: true };
  result = { Number, default: 0 };
  pid = { type: String, index: true };
  date = { type: Date, default: Date.now };
  codeLength = Number;
  timeUsage = Number;
  memoryUsage = Number;

  @pre('save')
  static async getSid(next) {
    this.codeLength = this.code.length;
    if (this.sid) return;
    const solCounter = await Counter.add('Submission');
    this.sid = solCounter + 100000;
    next();
  }
}

const submission = new Submission();
export default submission.generateModel();
