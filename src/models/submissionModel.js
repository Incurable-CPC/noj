/**
 * Created by cpc on 2/26/16.
 */

import { Model, pre } from 'mongoose-babelmodel';
import Counter from './counterModel';

class Submission extends Model {
  sid = { type: String, index: { unique: true } };
  code = String;
  lang = Number;
  user = { type: String, index: true };
  pid = { type: Number, index: true };
  date = { type: Date, default: Date.now };
  codeLength = Number;
  timeUsage = Number;
  memoryUsage = Number;

  @pre('save')
  static async getSid(next) {
    this.codeLength = this.code.length;
    if (this.sid) return;
    const solCounter = await Counter.add('Submissioin');
    this.sid = solCounter + 100000;
    next();
  }
}

const submission = new Submission();
export default submission.generateModel();
