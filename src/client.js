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

import { root } from './config';
import store from './stores';
import App from './components/App';
import Index from './components/Pages/Index';
import LoginForm from './components/Forms/LoginForm';
import ProblemPage from './components/Pages/ProblemPage';
import ProblemListPage from './components/Pages/ProblemListPage';
import ProblemEditPage from './components/Pages/ProblemEditPage';
import SubmissionListPage from './components/Pages/SubmissionListPage';
import ContestListPage from './components/Pages/ContestListPage';
import ContestEditPage from './components/Pages/ContestEditPage';
import ContestOverviewPage from './components/Pages/Contest/ContestOverviewPage';
import ContestProblemPage from './components/Pages/Contest/ContestProblemPage';
import ContestSubmissionListPage from './components/Pages/Contest/ContestSubmissionListPage';
import ContestBoardPage from './components/Pages/Contest/ContestBoardPage';
import ContestClarifyPage from './components/Pages/Contest/ContestClarifyPage';
import UserInfoPage from './components/Pages/User/UserInfoPage';
import UserListPage from './components/Pages/UserListPage';
// import Test from './components/Test';

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
  loadAuthedUserInfo,
} from './actions/authActions';
import {
  getUserInfo,
  getUserList,
} from './actions/userActions';

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
  await store.dispatch(loadAuthedUserInfo());
  // await store.dispatch(timeInit());
  next();
};

const boundGetUserInfo = async (nextState, replace, next) => {
  const { username } = nextState.params;
  if (await store.dispatch(getUserInfo(username))) next();
};

const boundGetUserList = async (nextState, replace, next) => {
  if (await store.dispatch(getUserList())) next();
};

const requireAuth = (nextState, replace) => {
  // if (!store.state.auth.has('username')) {
  //   toast('error', 'Please login first');
  //   replace('/');
  // }
};

const appContainer = document.getElementById('app');
ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={root} onEnter={boundInit} component={App}>
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
        <Route path="users" >
          <IndexRoute onEnter={requireAuth} component={UserInfoPage} />
          <Route path=":username" onEnter={boundGetUserInfo} component={UserInfoPage} />
        </Route>
        <Route path="standing" onEnter={boundGetUserList} component={UserListPage} />
        <Route path="*" component={Index} />
      </Route>
    </Router>
  </Provider>
), appContainer);
