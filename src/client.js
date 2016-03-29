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
import ContestListPage from './components/Pages/ContestListPage.jsx';
import ContestEditPage from './components/Pages/ContestEditPage.jsx';

import { getProblem, initProblem, getProblemListByPage } from './actions/ProblemActions';
import { getContest, initContest, getContestListByPage } from './actions/ContestActions';
import { getSubmissionList } from './actions/SubmissionActions';
import { loadUserInfo } from './actions/AuthActions';

const boundGetProblem = async (nextState, replace, next) => {
  const { params: { pid } } = nextState;
  if (await store.dispatch(getProblem(pid))) next();
};

const boundInitProblem = () => store.dispatch(initProblem());

const boundGetProblemListByPage = async (nextState, replace, next) => {
  const { params } = nextState;
  const page = Number(params.page) || 1;
  if (await store.dispatch(getProblemListByPage(page))) next();
};

const boundInitContest = () => store.dispatch(initContest());

const boundGetContest = async (nextState, replace, next) => {
  const { params: { cid } } = nextState;
  if (await store.dispatch(getContest(cid))) next();
};

const boundGetContestListByPage = async (nextState, replace, next) => {
  const { params } = nextState;
  const page = Number(params.page) || 1;
  if (await store.dispatch(getContestListByPage(page))) next();
};

const boundGetSubmissionList = async(nextState, replace, next) => {
  const { params } = nextState;
  const condition = Object.assign({}, params);
  condition.page = Number(condition.page) || 1;
  if (await store.dispatch(getSubmissionList(condition))) next();
};

const boundLoadUserInfo = async(nextState, replace, next) => {
  await store.dispatch(loadUserInfo());
  next();
};

const appContainer = document.getElementById('app');
ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" onEnter={boundLoadUserInfo} component={App}>
        <IndexRoute component={Index}/>
        <Route path="login" component={LoginForm} />
        <Route path="problems">
          <IndexRoute onEnter={boundGetProblemListByPage} component={ProblemListPage} />
          <Route path="page/:page" onEnter={boundGetProblemListByPage} component={ProblemListPage}/>
          <Route path="add" onEnter={boundInitProblem} component={ProblemEditPage}/>
          <Route path=":pid" onEnter={boundGetProblem}>
            <IndexRoute component={ProblemPage} />
            <Route path="edit" component={ProblemEditPage} />
            <Route path="status" onEnter={boundGetSubmissionList} component={SubmissionListPage} />
          </Route>
        </Route>
        <Route path="contests">
          <IndexRoute onEnter={boundGetContestListByPage} component={ContestListPage} />
          <Route path="page/:page" onEnter={boundGetContestListByPage} component={ContestListPage}/>
          <Route path="add" onEnter={boundInitContest} component={ContestEditPage} />
          <Route path=":cid" onEnter={boundGetContest}>
            <Route path="edit" component={ContestEditPage} />
          </Route>
        </Route>
        <Route path="status" onEnter={boundGetSubmissionList} component={SubmissionListPage} />
        <Route path="*" component={Index} />
      </Route>
    </Router>
  </Provider>
), appContainer);
