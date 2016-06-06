/**
 * Create by cpc on 1/31/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import withStyle from '../../decorators/withStyles';
import s from './SmallForm.scss';

const styles = {
  hiddlen: {
    position: 'absolute',
    left: -9999,
  },
};
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

  _handleSubmit = (evt) => {
    evt.preventDefault();
    this.props.login();
  }

  render() {
    const {
      disabled,
      withoutAction,
      fields: { username, password },
      } = this.props;
    return (
      <form className={s.form} onSubmit={this._handleSubmit}>
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
        <FlatButton
          style={withoutAction ? styles.hiddlen : {}}
          className={s.action}
          disabled={disabled}
          label="Login"
          type="submit"
          primary
        />
        <div style={{ clear: 'both' }} />
      </form>
    );
  }
}
