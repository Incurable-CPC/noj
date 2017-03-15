/**
 * Create by cpc on 1/9/16.
 **/

import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LoginForm from '../Forms/LoginForm.jsx';

export default class LoginDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
  };

  render() {
    const { open, hide, login } = this.props;
    const actions = [
      <FlatButton
        label="close"
        onTouchTap={hide}
      />,
      <FlatButton
        primary
        keyboardFocused
        label="Login"
        onTouchTap={login}
      />,
    ];
    return (
      <Dialog
        title="User Login"
        actions={actions}
        open={open}
        onRequestClose={hide}
        contentStyle={{ maxWidth: 450 }}
      ><LoginForm /></Dialog>
    );
  }
}
