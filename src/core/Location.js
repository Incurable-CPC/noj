/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { routeActions } from 'react-router-redux';
import store from '../stores';
import { root } from '../config';

const url = (_) => root + _;

export default {
  push: _ => store.dispatch(routeActions.push(url(_))),
  replace: _ => store.dispatch(routeActions.replace(url(_))),
  go: _ => store.dispatch(routeActions.go(url(_))),
  goForward: () => store.dispatch(routeActions.goForward()),
  goBack: () => store.dispatch(routeActions.goBack()),
};
