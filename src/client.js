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
import { Router, IndexRoute, IndexRedirect, Route, browserHistory } from 'react-router';

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
import ContestOverviewPage from './components/Pages/Contest/ContestOverviewPage.jsx';
import ContestProblemPage from './components/Pages/Contest/ContestProblemPage.jsx';
import ContestSubmissionListPage from './components/Pages/Contest/ContestSubmissionListPage.jsx';
import ContestBoardPage from './components/Pages/Contest/ContestBoardPage.jsx';
import ContestClarifyPage from './components/Pages/Contest/ContestClarifyPage';
// import Test from './components/Test.jsx';

import {
  getProblem,
  initProblem,
  getProblemListByPage,
} from './actions/problemActions';
import {
  getContest,
  initContest,
  setContestPid,
  updateContest,
  getContestListByPage,
} from './actions/contestActions';
import {
  getSubmissionList,
} from './actions/submissionActions';
import {
  loadUserInfo,
} from './actions/authActions';

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

const boundSetContestPid = (nextState) => {
  const { params: { pid } } = nextState;
  store.dispatch(setContestPid(pid));
};

const boundUpdateContest = () => {
  store.dispatch(updateContest(true));
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

const boundInit = async(nextState, replace, next) => {
  await store.dispatch(loadUserInfo());
  // await store.dispatch(timeInit());
  next();
};

const appContainer = document.getElementById('app');
ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" onEnter={boundInit} component={App}>
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
          <Route path=":cid" onEnter={boundGetContest} onChange={boundUpdateContest}>
            <IndexRedirect to="overview" />
            <Route path="overview" component={ContestOverviewPage} />
            <Route path="problems" component={ContestProblemPage}>
              <Route path=":pid" onEnter={boundSetContestPid} />
            </Route>
            <Route path="status" component={ContestSubmissionListPage} />
            <Route path="clarify" component={ContestClarifyPage} />
            <Route path="standing" component={ContestBoardPage} />
            <Route path="edit" component={ContestEditPage} />
            <Route path="*" component={ContestOverviewPage} />
          </Route>
        </Route>
        <Route path="status" onEnter={boundGetSubmissionList} component={SubmissionListPage} />
        <Route path="*" component={Index} />
      </Route>
    </Router>
  </Provider>
), appContainer);
