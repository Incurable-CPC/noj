/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import store from './stores';
import App from './components/App';
import Index from './components/Pages/Index.jsx';
import LoginForm from './components/Forms/LoginForm.jsx';
import ProblemPage from './components/Pages/ProblemPage.jsx';
import ProblemsListPage from './components/Pages/ProblemsListPage.jsx';
import ProblemsEditPage from './components/Pages/ProblemEditPage.jsx';
import Test from './components/Test.jsx';

const appContainer = document.getElementById('app');
ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Index}/>
        <Route path="login" component={LoginForm} />
        <Route path="problems">
          <IndexRoute component={ProblemsListPage} />
          <Route path="page/:page" component={ProblemsListPage}/>
          <Route path="add" component={ProblemsEditPage}/>
          <Route path=":pid">
            <IndexRoute component={ProblemPage} />
            <Route path="edit" component={ProblemsEditPage} />
          </Route>
        </Route>
        <Route path="contests" component={Test} />
        <Route path="*" component={Index} />
      </Route>
    </Router>
  </Provider>
), appContainer);
