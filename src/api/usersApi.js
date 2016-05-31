/**
 * Created by cpc on 1/12/16.
 */

import { Router } from 'express';
import User from '../models/userModel';
import { requireAuth, getUsername, setListSkip, handleError } from './common';
import { listFields } from '../constants/UserConstants';
const router = new Router();

const checkUsername = handleError(async (req, res, next) => {
  const { username } = req.params;
  const user = await User
    .findOne({ username })
    .select('username');
  if (user) next();
  else res.status(404).send({ error: 'User not exist' });
});

const getUserInfo = handleError(async (req, res) => {
  const { username } = req.params;
  const user = await User
    .findOne({ username })
    .select('-password -tokens');
  res.send({ user });
});

const getUserInfoUpdate = handleError(async (req, res) => {
  const { username } = req.params;
  const query = User
    .findOne({ username })
    .select('-password -tokens');
  listFields.forEach(setListSkip(req, query));
  const user = await query;
  res.send({ user });
});

const followUser = handleError(async (req, res) => {
  const { username } = req.params;
  const authedUser = getUsername(req);
  if (username === authedUser) {
    return res.status(406).send({ error: 'You can\'t follow yourself'});
  }
  await User.findOneAndUpdate(
    { username },
    { $addToSet: { followers: authedUser } });
  await User.findOneAndUpdate(
    { username: authedUser },
    { $addToSet: { following: username } });
  res.send({
    auth: { following: username },
    user: { followers: authedUser },
  });
});

router.all('/:username', checkUsername);
router.get('/:username', getUserInfo);
router.get('/:username/update', getUserInfoUpdate);

router.all('*', requireAuth);
router.post('/:username/followers', followUser);

export default router;
