/**
 * Created by cpc on 1/29/16.
 */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';

import dialogReducer from './reducers/dialog';
import authReducer from './reducers/auth';
import userReducer from './reducers/user';
import problemReducer from './reducers/problem';
import submissionReducer from './reducers/submission';
import contestReducer from './reducers/contest';

const reducers = combineReducers({
  routing: routerReducer,
  dialog: dialogReducer,
  auth: authReducer,
  user: userReducer,
  form: formReducer,
  problem: problemReducer,
  contest: contestReducer,
  submission: submissionReducer,
});

// Sync dispatched route actions to the history
const reduxRouterMiddleware = routerMiddleware(browserHistory);
const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  applyMiddleware(reduxRouterMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithMiddleware(reducers);

export default store;
