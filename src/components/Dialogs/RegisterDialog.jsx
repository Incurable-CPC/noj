/**
 * Create by cpc on 1/9/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RegisterForm from '../Forms/RegisterForm.jsx';

export default class RegisterDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    auth: ImmutableTypes.map.isRequired,
  };
  render() {
    const { open, hide, register, auth } = this.props;
    const disabled = auth.has('status');
    const handleClick = async () => {
      if (await register()) {
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
        label="Register"
        onTouchTap={handleClick}
        disabled={disabled}
      />,
    ];
    return (
      <Dialog
        title="User Register"
        actions={actions}
        open={open}
        onRequestClose={hide}
        contentStyle={{ maxWidth: 450 }}
      ><RegisterForm withoutAction register={register} disabled={disabled}/></Dialog>
    );
  }
}
