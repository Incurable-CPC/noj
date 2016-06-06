/**
 * Create by cpc on 1/31/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import withStyle from '../../decorators/withStyles';
import s from './SmallForm.scss';
import { usernameChecker } from '../../check/authChecker';

const styles = {
  hiddlen: {
    position: 'absolute',
    left: -9999,
  },
};
const fields = ['username', 'password', 'confirmPassword'];
@withStyle(s)
@reduxForm({ form: 'register', fields })
export default class LoginForm extends Component {
  static propTypes = {
    register: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    withoutAction: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  _handleSubmit = (evt) => {
    evt.preventDefault();
    this.props.register();
  };

  render() {
    const {
      disabled,
      withoutAction,
      fields: { username, password, confirmPassword },
      } = this.props;
    return (
      <form className={s.form} onSubmit={this._handleSubmit}>
        <TextField
          {...username}
          fullWidth
          floatingLabelText="Username"
          errorText={usernameChecker(username.value)}
        />
        <TextField
          {...password}
          fullWidth
          type="password"
          floatingLabelText="Password"
        />
        <TextField
          {...confirmPassword}
          fullWidth
          type="password"
          floatingLabelText="Confirm Password"
        />
        <FlatButton
          style={withoutAction ? styles.hiddlen : {}}
          className={s.action}
          disable={disabled}
          label="register"
          type="submit"
          primary
        />
        <div style={{ clear: 'both' }} />
      </form>
    );
  }
}
