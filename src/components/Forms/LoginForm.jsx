/**
 * Create by cpc on 1/31/16.
 **/

import React, { Component, PropTypes } from 'react';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import FlatButton from 'material-ui/FlatButton';

import { login } from '../../actions/auth';
import withStyle from '../../decorators/withStyles';
import { TextInput } from './Inputs';
import s from './SmallForm.scss';

const styles = {
  hidden: {
    display: 'none',
  },
};

const form = 'login';
@withStyle(s)
@reduxForm({ form })
export default class LoginForm extends Component {
  static propTypes = {
    withAction: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  render() {
    const {
      withAction,
      handleSubmit,
      submitting,
      } = this.props;
    return (
      <Form className={s.form} onSubmit={handleSubmit(login())}>
        <Field
          name="username" label="Username"
          fullWidth
          component={TextInput}
        />
        <Field
          name="password" label="Password"
          type="password"
          fullWidth
          component={TextInput}
        />
        <FlatButton
          style={withAction ? {} : styles.hidden}
          className={s.action}
          disabled={submitting}
          label="Login"
          type="submit"
          primary
        />
        <div style={{ clear: 'both' }} />
      </Form>
    );
  }
}
