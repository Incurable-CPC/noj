/**
 * Created by cpc on 1/12/16.
 */

import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import { getUsername, requireAuth, handleError } from './common';
import { useAwait } from '../core';
import { loginChecker, registerChecker, passwordsChecker } from '../check/authChecker';
const router = new Router();

const compare = useAwait(bcrypt.compare);
const genSalt = useAwait(bcrypt.genSalt);
const hash = useAwait(bcrypt.hash);

const login = handleError(async(req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  let error = loginChecker(username, password);
  if (!user) {
    error = 'User not exist';
  } else if (!(await compare(password, user.password))) {
    error = 'Password not correct';
  }
  if (error) {
    res.status(401).send({ error });
  } else {
    const token = await User.addToken(username);
    res.status(200).send({ token });
  }
});

const logout = handleError(async (req, res) => {
  const { username, token } = req.body.auth || {};
  await User.removeToken(username, token);
  res.send({});
});

const register = handleError(async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  let error = registerChecker(username, password, confirmPassword);
  if (error) res.status(406);
  const salt = await genSalt();
  const bcrypted = await hash(password, salt);
  if ((await User.find({ username }).count()) > 0) {
    res.status(409);
    error = 'User exist already';
  }
  if (error) {
    res.send({ error });
  } else {
    const newUser = new User({ username, password: bcrypted });
    await newUser.save();
    const token = await User.addToken(username);
    res.status(201).send({ token });
  }
});

const changePassword = handleError(async (req, res) => {
  const { oldPassword, password, confirmPassword } = req.body;
  const username = getUsername(req);
  console.log(username);
  const user = await User.findOne({ username });
  let error = passwordsChecker(oldPassword, password, confirmPassword);
  if (!user) {
    error = 'User not exist';
  } else if (!(await compare(oldPassword, user.password))) {
    error = 'Password not correct';
  }
  if (error) {
    res.status(406).send({ error });
  } else {
    const salt = await genSalt();
    const bcrypted = await hash(password, salt);
    await User.findOneAndUpdate(
      { username }, {
        $set: { password: bcrypted },
        $unset: { tokens: true },
      });
    const token = await User.addToken(username);
    res.status(200).send({ token });
  }
});

router.post('/login', login);
router.post('/register', register);

router.all('*', requireAuth);
router.post('/logout', logout);
router.post('/passwords', changePassword);

export default router;
