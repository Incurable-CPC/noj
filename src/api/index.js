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
import problemApi from './problemsApi';
import submissionApi from './submissionsApi';
import contestsApi from './contestsApi';
const router = new Router();

router.use('/auth', authApi);
router.use('/problems', problemApi);
router.use('/submissions', submissionApi);
router.use('/contests', contestsApi);
router.get('/cur', (req, res) => res.send({ cur: new Date() }));

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
