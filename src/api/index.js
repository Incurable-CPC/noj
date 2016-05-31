/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { Router } from 'express';
import authApi from './authApi';
import userApi from './usersApi';
import problemApi from './problemsApi';
import submissionApi from './submissionsApi';
import contestsApi from './contestsApi';
import { getUsername, handleError } from './common';
import User from '../models/userModel';
import moment from 'moment';
const router = new Router();

const checkTime = handleError(async (req, res, next) => {
  const username = getUsername(req);
  const { lastOperate } = await User
    .findOneAndUpdate(
      { username },
      { $currentDate: { lastOperate: true } })
    .select('lastOperate');
  const cur = moment();
  const diff = cur.diff(lastOperate, 'seconds');
  if (diff < 5) res.status(406).send({ error: 'Operate too fast' });
  else next();
});
router.post('*', checkTime);
router.use('/auth', authApi);
router.use('/users', userApi);
router.use('/problems', problemApi);
router.use('/submissions', submissionApi);
router.use('/contests', contestsApi);
router.get('/time', (req, res) => res.send({ time: moment() }));

router.use((req, res) => {
  res.status(404).send({ error: 'API not found' });
});

/*eslint-disable */
router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ error: 'Unknown error' });
});
/*eslint-enable */

export default router;
