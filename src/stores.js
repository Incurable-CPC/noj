/**
 * Created by cpc on 1/29/16.
 */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { syncHistory, routeReducer } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';

import dialogReducer from './reducers/DialogReducer';
import authReducer from './reducers/AuthReducer';
import problemReducer from './reducers/ProblemReducer';
import submissionReducer from './reducers/SubmissionReducer';

const reducer = combineReducers({
  routing: routeReducer,
  dialog: dialogReducer,
  auth: authReducer,
  form: formReducer,
  problem: problemReducer,
  submission: submissionReducer,
});

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(browserHistory);
const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  applyMiddleware(reduxRouterMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithMiddleware(reducer);
reduxRouterMiddleware.listenForReplays(store);

export default store;
