/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { browserHistory } from 'react-router';
import { root } from '../config';

const url = (_) => root + _;

export default {
  push: _ => browserHistory.push(url(_)),
  replace: _ => browserHistory.replace(url(_)),
  go: num => browserHistory.go(num),
  goForward: () => browserHistory.goForward(),
  goBack: () => browserHistory.goBack(),
};
