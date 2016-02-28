/**
 * Create by cpc on 1/31/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

import withStyle from '../../decorators/withStyles';
import s from './SmallForm.scss';

const fields = ['username', 'password'];
@withStyle(s)
@reduxForm({ form: 'login', fields })
export default class LoginForm extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    withoutAction: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  render() {
    const {
      login,
      disabled,
      withoutAction,
      fields: { username, password },
      } = this.props;
    return (
      <form className={s.form} >
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
        {withoutAction ? null : (
          <FlatButton
            className={s.action}
            primary
            label="Login"
            onClick={login}
            disabled={disabled}
          />
        )}
      </form>
    );
  }
}
