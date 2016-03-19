/**
 * Created by cpc on 2/22/16.
 */

import User from '../models/userModel';

export const requireAuth = async (req, res, next) => {
  try {
    const { username, token } = req.cookies || {};
    if (!(await User.checkToekn(username, token))) {
      res.status(401).send({ error: 'Please login first' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const { username, token } = req.cookies || {};
    if (!(await User.checkAdminToken(username, token))) {
      res.status(401).send({ error: 'Unauthorized opeartion' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};
