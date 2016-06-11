/**
 * Created by cpc on 1/12/16.
 */

import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';

import { useAwait } from '../core';
import User from '../models/User';
import { requireAuth, getUsername, setListSkip, handleError } from './common';
import { listFields } from '../constants/user';
import { checkAvatar, checkInfo } from '../check/user';
const router = new Router();

const upload = multer({
  dest: path.join(__dirname, 'tmp'),
});

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
    list.push(following);
    cond.username = { $in: list };
  } else if (follower) {
    const list = (await User
      .findOne({ username: follower })
      .select('following')).following;
    list.push(follower);
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
  following.push(username);
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
  followers.push(username);
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

const rename = useAwait(fs.rename);
const unlink = useAwait(fs.unlink);
const postAvatar = handleError(async (req, res) => {
  const avatar = req.file;
  const error = checkAvatar(avatar);
  if (error) {
    await unlink(avatar.path);
    return res.status(409).send({ error });
  }
  const newPath = path.join('/img', 'uploads', avatar.filename);
  await rename(avatar.path, path.join(__dirname, 'public', newPath));
  const { username } = req.params;
  await User.findOneAndUpdate(
    { username },
    { $set: { ['info.avatar']: newPath } });
  res.send({ user: { avatar: newPath } });
});

const postInfo = handleError(async (req, res) => {
  const {
    params: { username },
    body: { info },
  } = req;
  const error = checkInfo(info);
  if (error) return res.status(409).send({ error });
  const $set = {};
  Object.keys(info).forEach((key) =>
    $set[`info.${key}`] = info[key]);
  const user = await User
    .findOneAndUpdate(
      { username },
      { $set }, { new: true })
    .select('info');
  res.send({ user });
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
router.post('/:username/avatar', upload.single('avatar'), postAvatar);
router.post('/:username/info', postInfo);

export default router;
