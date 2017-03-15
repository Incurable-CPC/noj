/**
 * Created by cpc on 1/29/16.
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form/immutable';
import { Map, fromJS } from 'immutable';
import thunk from 'redux-thunk';

import dialogReducer from './reducers/dialog';
import authReducer from './reducers/auth';
import userReducer from './reducers/user';
import problemReducer from './reducers/problem';
import submissionReducer from './reducers/submission';
import contestReducer from './reducers/contest';

const initialRouting = fromJS({ locationBeforeTransitions: null });

const routerReducer = (state = initialRouting, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.set('locationBeforeTransitions', action.payload);
    default:
      return state;
  }
};

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

const initState = new Map();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, initState, composeEnhancers(
  applyMiddleware(thunk)
));

export default store;
