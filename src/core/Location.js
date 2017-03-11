/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { push, replace, go, goForward, goBack } from 'react-router-redux';
import store from '../stores';
import { root } from '../config';

const url = (_) => root + _;

export default {
  push: _ => store.dispatch(push(url(_))),
  replace: _ => store.dispatch(replace(url(_))),
  go: _ => store.dispatch(go(_)),
  goForward: () => store.dispatch(goForward()),
  goBack: () => store.dispatch(goBack()),
};
