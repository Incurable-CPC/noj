/**
 * Create by cpc on 6/6/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { postUserInfo } from '../../../actions/userActions';

const fields = ['nick', 'school', 'email'];
const styles = {
  actions: { float: 'right' },
};

@reduxForm({
  form: 'userInfo',
  fields,
}, (state) => ({ initialValues: state.auth.get('info').toJS() }))
export default class UserInfoForm extends Component {
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
      fields: { nick, school, email },
      submitting, handleSubmit,
    } = this.props;
    return (
      <form onSubmit={handleSubmit(postUserInfo(username))}>
        <h3>Basic Info</h3>
        <div>
          <TextField
            floatingLabelText="Nick"
            fullWidth
            {...nick}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="School"
            {...school}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="Email"
            {...email}
          />
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
      </form>
    );
  }
}
