/**
 * Create by cpc on 6/7/16.
 **/

import React, { Component, PropTypes } from 'react';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';

import { TextInput } from '../Inputs';
import { changePassword } from '../../../actions/auth';

const styles = {
  actions: { float: 'right' },
};

const form = 'account';

@reduxForm({ form })
export default class AccountForm extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  render() {
    const {
      username,
      submitting, handleSubmit,
    } = this.props;
    return (
      <Form onSubmit={handleSubmit(changePassword(username))}>
        <h3>Change Password</h3>
        <div>
          <Field
            name="oldPassword" label="Old Password"
            type="password"
            component={TextInput}
          />
        </div>
        <div>
          <Field
            name="password" label="New Password"
            type="password"
            component={TextInput}
          />
        </div>
        <div>
          <Field
            name="confirmPassword" label="Confirm Password"
            type="password"
            component={TextInput}
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
      </Form>
    );
  }
}
