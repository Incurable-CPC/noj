/**
 * Created by cpc on 1/12/16.
 */

import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';
const upload = multer({ dest: path.join(__dirname, 'tmp') });

import { useAwait } from '../core';
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

const checkSelf = handleError(async (req, res, next) => {
  const { username } = req.params;
  const authedUser = getUsername(req);
  if (username === authedUser) next();
  else res.status(401).send({ error: 'You can only modify your own account' });
});

const handleUserFollowInfo = (user, authedUser) => {
  const { followers, following } = user;
  user.followersCnt = followers.length;
  user.followingCnt = following.length;
  user.isFollower = following.indexOf(authedUser) >= 0;
  user.isFollowing = followers.indexOf(authedUser) >= 0;
  user.followers = user.following = undefined;
};

const getUserInfo = handleError(async (req, res) => {
  const authedUser = getUsername(req);
  const { username } = req.params;
  const user = (await User
    .findOne({ username })
    .select('-password -tokens')).toObject();
  handleUserFollowInfo(user, authedUser);
  res.send({ user });
});

const getUserInfoUpdate = handleError(async (req, res) => {
  const authedUser = getUsername(req);
  const { username } = req.params;
  const query = User
    .findOne({ username })
    .select('-password -tokens');
  listFields.forEach(setListSkip(req, query));
  const user = (await query.exec()).toObject();
  handleUserFollowInfo(user, authedUser);
  res.send({ user });
});

const NUM_PEER_PAGE = 25;
const getUserListFromDB = async (page, cond) => {
  let stages = [];
  if (cond) stages.push({ $match: cond });
  stages = stages.concat([
    { $project: {
      username: true,
      avatar: '$info.avatar',
      nick: '$info.nick',
      solved: { $size: '$solved' },
    } },
    { $sort: { solved: -1 } },
    { $skip: NUM_PEER_PAGE * (page - 1) },
    { $limit: NUM_PEER_PAGE },
  ]);
  return await User.aggregate(stages).exec();
};
const getUserList = handleError(async (req, res) => {
  const { following, follower } = req.query;
  const page = Number(req.query.page) || 1;
  const cond = {};
  if (following) {
    const list = (await User
      .findOne({ username: following })
      .select('followers')).followers;
    cond.username = { $in: list };
  } else if (follower) {
    const list = (await User
      .findOne({ username: follower })
      .select('following')).following;
    cond.username = { $in: list };
  }
  const userList = await getUserListFromDB(page, cond);
  const count = Math.ceil((await User.find().count()) / NUM_PEER_PAGE);
  return res.send({
    count,
    userList,
  });
});

const getUserFollowingList = handleError(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const { username } = req.params;
  const { following } = await User
    .findOne({ username })
    .select('following');
  const cond = { username: { $in: following } };
  const userList = await getUserListFromDB(page, cond);
  const count = Math.ceil(following.length / NUM_PEER_PAGE);
  res.send({
    count,
    userList,
  });
});

const getUserFollowersList = handleError(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const { username } = req.params;
  const { followers } = await User
    .findOne({ username })
    .select('followers');
  const cond = { username: { $in: followers } };
  const userList = await getUserListFromDB(page, cond);
  const count = Math.ceil(followers.length / NUM_PEER_PAGE);
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
  const operate = follow ? '$addToSet' : '$pull';
  await User.findOneAndUpdate(
    { username },
    { [operate]: { followers: authedUser } });
  await User.findOneAndUpdate(
    { username: authedUser },
    { [operate]: { following: username } });
  res.send({
    auth: { following: username },
    user: { followers: authedUser },
  });
});

const readFile = useAwait(fs.readFile);
const writeFile = useAwait(fs.writeFile);
const unlink = useAwait(fs.unlink);
const modifyAvatar = handleError(async (req, res) => {
  const avatar = req.file;
  const data = await readFile(avatar.path);
  const newPath = path.join('img', 'uploads', avatar.filename);
  await writeFile(path.join(__dirname, 'public', newPath), data);
  await unlink(avatar.path);
  const { username } = req.params;
  await User.findOneAndUpdate(
    { username },
    { $set: { ['info.avatar']: newPath } });
  res.send({ user: { avatar: newPath } });
});

router.get('/', getUserList);
router.all('/:username', checkUsername);
router.get('/:username', getUserInfo);
router.get('/:username/update', getUserInfoUpdate);
router.get('/:username/following', getUserFollowingList);
router.get('/:username/followers', getUserFollowersList);

router.all('*', requireAuth);
router.post('/:username/followers', followUser);

router.post('/:username', checkSelf);
router.post('/:username/avatar', upload.single('avatar'), modifyAvatar);

export default router;
