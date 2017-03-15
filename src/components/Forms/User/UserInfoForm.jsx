/**
 * Create by cpc on 6/6/16.
 **/

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';

import { TextInput } from '../Inputs';
import { postUserInfo } from '../../../actions/user';

const styles = {
  actions: { float: 'right' },
};

const form = 'userInfo';

@connect(state => ({
  initialValues: state.getIn(['auth', 'info']).toJS(),
}))
@reduxForm({ form })
export default class UserInfoForm extends Component {
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
      <Form onSubmit={handleSubmit(postUserInfo(username))}>
        <h3>Basic Info</h3>
        <div>
          <Field
            name="nick" label="Nick"
            component={TextInput}
            fullWidth
          />
        </div>
        <div>
          <Field name="school" label="School" component={TextInput}/>
        </div>
        <div>
          <Field name="email" label="Email" component={TextInput}/>
        </div>
        <div style={styles.actions}>
          <RaisedButton
            primary
            type="submit"
            label="update"
            disabled={submitting}
          />
        </div>
        <div style={{ clear: 'both' }} />
      </Form>
    );
  }
}
