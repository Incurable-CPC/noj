/**
 * Create by cpc on 6/7/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { changePassword } from '../../../actions/auth';

const fields = ['oldPassword', 'password', 'confirmPassword'];
const styles = {
  actions: { float: 'right' },
};

@reduxForm({
  form: 'account',
  fields,
})
export default class AccountForm extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  render() {
    const {
      username,
      fields: { oldPassword, password, confirmPassword },
      submitting, handleSubmit,
    } = this.props;
    return (
      <form onSubmit={handleSubmit(changePassword(username))}>
        <h3>Change Password</h3>
        <div>
          <TextField
            floatingLabelText="Old Password"
            type="password"
            {...oldPassword}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="New Password"
            type="password"
            {...password}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="Confirm Password"
            type="password"
            {...confirmPassword}
          />
        </div>
        <div style={styles.actions}>
          <RaisedButton
            primary
            type="submit"
            label="change"
            disabled={submitting}
          />
        </div>
        <div style={{ clear: 'both' }} />
      </form>
    );
  }
}
