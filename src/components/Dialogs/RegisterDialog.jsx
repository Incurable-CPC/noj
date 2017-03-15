/**
 * Create by cpc on 1/9/16.
 **/

import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RegisterForm from '../Forms/RegisterForm.jsx';

export default class RegisterDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
  };
  render() {
    const { open, hide, register } = this.props;
    const actions = [
      <FlatButton
        label="close"
        onTouchTap={hide}
      />,
      <FlatButton
        primary
        keyboardFocused
        label="Register"
        onTouchTap={register}
      />,
    ];
    return (
      <Dialog
        title="User Register"
        actions={actions}
        open={open}
        onRequestClose={hide}
        contentStyle={{ maxWidth: 450 }}
      ><RegisterForm /></Dialog>
    );
  }
}
