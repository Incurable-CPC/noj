/**
 * Created by cpc on 2/22/16.
 */

import User from '../models/User';

export const getUsername = (req) => {
  const { username } = req.cookies || {};
  return username;
};

export const handleError = (work) => async (req, res, next) => {
  try {
    await work(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const requireAuth = handleError(async (req, res, next) => {
  const { username, token } = req.cookies || {};
  if (!(await User.checkToken(username, token))) {
    res.status(401).send({ error: 'Please login first' });
  } else {
    next();
  }
});

export const requireAdmin = handleError(async (req, res, next) => {
  const { username, token } = req.cookies || {};
  if (!(await User.checkAdminToken(username, token))) {
    res.status(401).send({ error: 'Unauthorized opeartion' });
  } else {
    next();
  }
});

export const setListSkip = (req, query) => (field) => {
  const skip = Number((req.query[field] || {}).skip) || 0;
  const limit = Number((req.query[field] || {}).limit) || 100000;
  query.slice(field, [skip, limit]);
};
