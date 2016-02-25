/**
 * Created by cpc on 1/17/16.
 */

import { Model } from 'mongoose-babelmodel';

class Counter extends Model {
  _id = { type: String, required: true };
  cnt = { type: Number, default: 0 };

  static async add(id) {
    const counter = await this.findByIdAndUpdate(id,
      { $inc: { cnt: 1 } },
      { upsert: true });
    const ret = counter ? counter.cnt : 0;
    return ret;
  }
}

const counter = new Counter();
export default counter.generateModel();
