/**
 * Create by cpc on 1/9/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LoginForm from '../Forms/LoginForm.jsx';

export default class LoginDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    auth: ImmutableTypes.map.isRequired,
  };

  render() {
    const { open, hide, login, auth } = this.props;
    const disabled = auth.has('status');
    const handleClick = async () => {
      if (await login()) {
        hide();
      }
    };

    const actions = [
      <FlatButton
        label="close"
        onTouchTap={hide}
      />,
      <FlatButton
        primary
        keyboardFocused
        label="Login"
        onTouchTap={handleClick}
        disabled={disabled}
      />,
    ];
    return (
      <Dialog
        title="User Login"
        actions={actions}
        open={open}
        onRequestClose={hide}
        contentStyle={{ maxWidth: 450 }}
      ><LoginForm withoutAction login={login} disabled={disabled}/></Dialog>
    );
  }
}
