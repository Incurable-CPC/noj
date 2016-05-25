/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes, createFactory } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { cyan500, white, black } from 'material-ui/styles/colors';

import s from './App.scss';
import { showDialog, hideDialog } from '../../actions/dialogActions';
import { login, register, logout } from '../../actions/authActions';
import { root } from '../../config';
import Header from './Header';

import { ToastContainer, ToastMessage } from 'react-toastr';
const ToastMessageFactory = createFactory(ToastMessage.animation);
import { setContainer } from '../../core/toast';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const context = {
  insertCss: styles => styles._insertCss(),
  onSetTitle: value => document.title = value,
  onSetMeta: (name, content) => {
    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    const elements = document.getElementsByTagName('meta');
    [].slice.call(elements).forEach((element) => {
      if (element.getAttribute('name') === name) {
        element.parentNode.removeChild(element);
      }
    });
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.getElementsByTagName('head')[0].appendChild(meta);
  },
};

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme({
  fontFamily: '"Lucida Grande", "Lucida Sans", "Open Sans", sans-serif',
  button: { minWidth: 0 },
  inkBar: { backgroundColor: cyan500 },
  tabs: {
    backgroundColor: white,
    textColor: black,
    selectedTextColor: cyan500,
  },
});

@connect(state => state)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    dialog: PropTypes.string.isRequired,
    auth: ImmutableTypes.map,
    location: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };
  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
  };

  getChildContext() {
    return context;
  }

  componentDidMount() {
    this.removeCss = context.insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    const { dialog, location, params, dispatch, auth } = this.props;
    const match = location.pathname.match(new RegExp((params.cid) ?
      `${root}/contests/\\d*/([^/]*)` :
      `${root}/([^/]*)`));
    const active = (match) ? match[1] : 'empty';
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header
            cid={params.cid}
            auth={auth}
            dialog={dialog}
            active={active}
            login={() => dispatch(login())}
            logout={() => dispatch(logout())}
            register={() => dispatch(register())}
            showDialog={(_) => dispatch(showDialog(_))}
            hideDialog={() => dispatch(hideDialog())}
          />
          {this.props.children}
          <ToastContainer
            ref={setContainer}
            toastMessageFactory={ToastMessageFactory}
            className="toast-top-right"
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
