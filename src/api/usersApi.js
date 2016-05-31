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

const NUM_PEER_PAGE = 25;
const getUserList = handleError(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const userList = await User.aggregate([
    { $project: {
      username: true,
      info: { avatar: true, nick: true },
      solved: { $size: '$solved' },
    } },
    { $sort: { solved: -1 } },
    { $skip: NUM_PEER_PAGE * (page - 1) },
    { $limit: NUM_PEER_PAGE },
  ]).exec();
  const count = Math.ceil((await User.find().count()) / NUM_PEER_PAGE);
  res.send({
    count,
    userList,
  });
});

const followUser = handleError(async (req, res) => {
  const {
    params: { username },
    body: { follow },
  } = req;
  const authedUser = getUsername(req);
  const action = `${follow ? '' : 'un'}follow`;
  if (username === authedUser) {
    return res.status(406).send({ error: `You can't ${action} yourself` });
  }
  const log1 = { username: authedUser, follow, target: false };
  const log2 = { username, follow, target: true };
  await User.findOneAndUpdate(
    { username },
    { $push: { followLogs: log1 } });
  await User.findOneAndUpdate(
    { username: authedUser },
    { $push: { followLogs: log2 } });
  res.send({
    auth: { followLogs: log1 },
    user: { followLogs: log2 },
  });
});


router.get('/', getUserList);
router.all('/:username', checkUsername);
router.get('/:username', getUserInfo);
router.get('/:username/update', getUserInfoUpdate);

router.all('*', requireAuth);
router.post('/:username/followLogs', followUser);

export default router;
