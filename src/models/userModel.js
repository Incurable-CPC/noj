/**
 * Created by cpc on 1/12/16.
 */

import mongoose, { Schema } from 'mongoose';
import { createHash } from 'crypto';

export const userSchema = {
  username: { type: String, index: { unique: true } },
  password: String,
  tokens: [String],
  admin: Boolean,
  solved: [String],
  tried: [String],
  lastSubmit: Date,
  registerTime: { type: Date, default: Date.now },
  lastOperate: { type: Date, default: Date.now },
  info: {
    avatar: { type: String, default: '/img/default.png' },
    school: String,
    email: String,
  },
  followLogs: [{
    follow: Boolean,
    target: Boolean,
    username: String,
    Time: { type: Date, default: Date.now },
  }],
};

const schema = new Schema(userSchema);

schema.statics.checkToken = async function checkToken(username, token) {
  const cnt = await this.find({ username, tokens: token }).count();
  return cnt > 0;
};

schema.statics.checkAdminToken = async function checkAdminToken(username, token) {
  const user = await this.findOne({ username, tokens: token });
  return user && user.admin;
};

schema.statics.addToken = async function addToken(username) {
  const rand = Math.random();
  const str = new Date().toISOString() + rand;
  const token = createHash('md5').update(str).digest('base64');
  await this.findOneAndUpdate({ username }, {
    $push: { tokens: token },
  });
  return token;
};

schema.statics.removeToken = async function removeToken(username, token) {
  await this.findOneAndUpdate({ username }, {
    $pull: { tokens: token },
  });
};

const User = mongoose.model('User', schema);
export default User;
