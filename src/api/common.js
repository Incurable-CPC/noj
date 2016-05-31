/**
 * Created by cpc on 2/22/16.
 */

import User from '../models/userModel';

export const getUsername = (req) => {
  const { username } = req.cookies || {};
  return username;
};

export const requireAuth = async (req, res, next) => {
  try {
    const { username, token } = req.cookies || {};
    if (!(await User.checkToken(username, token))) {
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

export const setListSkip = (req, query) => (field) => {
  const skip = (req.query[field] || {}).skip || 0;
  const limit = (req.query[field]|| {}).limit || 100000;
  query.slice(field, [skip, limit]);
};

export const handleError = (work) => async (req, res, next) => {
  try {
    await work(req, res, next);
  } catch (error) {
    next(error);
  }
};
