/**
 * Created by cpc on 1/12/16.
 */

import { Model } from 'mongoose-babelmodel';
import { createHash } from 'crypto';

class User extends Model {
  username = { type: String, index: { unique: true } };
  password = String;
  tokens = [String];
  admin = Boolean;
  solved = [Number];
  tried = [Number];
  lastSubmit = Date;

  static async checkToekn(username, token) {
    const cnt = await this.find({ username, tokens: token }).count();
    return cnt > 0;
  }

  static async checkAdminToken(username, token) {
    const user = await this.findOne({ username, tokens: token });
    return user && user.admin;
  }

  static async addToken(username) {
    const rand = Math.random();
    const str = new Date().toISOString() + rand;
    const token = createHash('md5').update(str).digest('base64');
    await this.findOneAndUpdate({ username }, {
      $push: { tokens: token },
    });
    return token;
  }

  static async removeToken(username, token) {
    await this.findOneAndUpdate({ username }, {
      $pull: { tokens: token },
    });
  }
}

const user = new User();
export default user.generateModel();
