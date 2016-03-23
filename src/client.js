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
import ProblemListPage from './components/Pages/ProblemListPage.jsx';
import ProblemEditPage from './components/Pages/ProblemEditPage.jsx';
import SubmissionListPage from './components/Pages/SubmissionListPage.jsx';
import Test from './components/Test.jsx';

import { getProblem, initProblem, getProblemList } from './actions/ProblemActions';
import { getSubmissionList } from './actions/SubmissionListActions';

const boundGetProblem = async (nextState, replace, next) => {
  const { params: { pid } } = nextState;
  if (await store.dispatch(getProblem(pid))) next();
};

const boundInitProblem = () => store.dispatch(initProblem());

const boundGetProblemList = async (nextState, replace, next) => {
  const { params } = nextState;
  const condition = {
    page: params.page || 1,
  };
  if (await store.dispatch(getProblemList(condition))) next();
};

const boundGetSubmissionList = async(nextState, replace, next) => {
  const { params } = nextState;
  const condition = {
    page: params.page || 1,
  };
  if (await store.dispatch(getSubmissionList(condition))) next();
};

const appContainer = document.getElementById('app');
ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Index}/>
        <Route path="login" component={LoginForm} />
        <Route path="problems">
          <IndexRoute onEnter={boundGetProblemList} component={ProblemListPage} />
          <Route path="page/:page" onEnter={boundGetProblemList} component={ProblemListPage}/>
          <Route path="add" onEnter={boundInitProblem} component={ProblemEditPage}/>
          <Route path=":pid" onEnter={boundGetProblem}>
            <IndexRoute component={ProblemPage} />
            <Route path="edit" component={ProblemEditPage} />
            <Route path="status" onEnter={boundGetSubmissionList} component={SubmissionListPage} />
          </Route>
        </Route>
        <Route path="contests" component={Test} />
        <Route path="status" onEnter={boundGetSubmissionList} component={SubmissionListPage} />
        <Route path="*" component={Index} />
      </Route>
    </Router>
  </Provider>
), appContainer);
