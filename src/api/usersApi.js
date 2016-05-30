/**
 * Created by cpc on 1/12/16.
 */

import { Router } from 'express';
import User from '../models/userModel';
import { requireAuth, getUsername } from './common';
const router = new Router();

const getUserInfo = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User
      .findOne({ username })
      .select('-password -tokens');
    if (user) {
      res.send({ user });
    } else {
      res.status(404).send({ error: 'User not exist' });
    }
  } catch (err) {
    next(err);
  }
};

router.get('/:username', getUserInfo);

router.all('*', requireAuth);

export default router;
