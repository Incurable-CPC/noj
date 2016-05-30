/**
 * Created by cpc on 1/12/16.
 */

import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import { requireAuth, getUsername } from './common';
import { useAwait } from '../core';
import { loginChecker, registerChecker } from '../check/authChecker';
const router = new Router();

const compare = useAwait(bcrypt.compare);
const genSalt = useAwait(bcrypt.genSalt);
const hash = useAwait(bcrypt.hash);

const login = async(req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    let error = loginChecker(username, password);
    if (!user) {
      res.status(401);
      error = 'User not exist';
    } else if (!(await compare(password, user.password))) {
      res.status(401);
      error = 'Password not correct';
    }

    if (error) {
      res.send({ error });
    } else {
      const token = await User.addToken(username);
      res.status(200).send({ token });
    }
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { username, token } = req.body.auth || {};
    await User.removeToken(username, token);
    res.send({});
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const username = getUsername(req);
    const user = await User
      .findOne({ username })
      .select('-password -tokens');
    res.send({ user });
  } catch (err) {
    next(err);
  }
};

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);

router.all('*', requireAuth);
router.get('/info', getUserInfo);

export default router;
