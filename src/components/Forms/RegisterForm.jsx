/**
 * Create by cpc on 1/31/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

import withStyle from '../../decorators/withStyles';
import s from './SmallForm.scss';

const fields = ['username', 'password', 'confirmPassword'];
@withStyle(s)
@reduxForm({ form: 'register', fields })
export default class LoginForm extends Component {
  static propTypes = {
    register: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    withoutAction: PropTypes.bool,
  };
  render() {
    const {
      register,
      disabled,
      withoutAction,
      fields: { username, password, confirmPassword },
      } = this.props;
    return (
      <form className={s.form}>
        <TextField
          {...username}
          fullWidth
          floatingLabelText="Username"
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
        {withoutAction ? null : (
          <FlatButton
            className={s.action}
            primary
            label="Register"
            onClick={register}
            disabled={disabled}
          />
        )}
      </form>
    );
  }
}
