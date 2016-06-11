/**
 * Created by cpc on 1/17/16.
 */

import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  _id: { type: String, required: true },
  cnt: { type: Number, default: 0 },
});

schema.statics.add = async function add(id) {
  const counter = await this.findByIdAndUpdate(id,
    { $inc: { cnt: 1 } },
    { upsert: true });
  const ret = counter ? counter.cnt : 0;
  return ret;
};

const Counter = mongoose.model('Counter', schema);
export default Counter;
