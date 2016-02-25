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

export default {
  push: _ => store.dispatch(routeActions.push(_)),
  replace: _ => store.dispatch(routeActions.replace(_)),
  go: _ => store.dispatch(routeActions.go(_)),
  goForward: () => store.dispatch(routeActions.goForward()),
  goBack: () => store.dispatch(routeActions.goBack()),
};
