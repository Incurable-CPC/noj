/**
 * Create by cpc on 5/14/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import s from './EditForm.scss';
import withStyles from '../../decorators/withStyles';
import { postContestAnswer } from '../../actions/contestActions';

const fields = ['cid', 'qid', 'answer'];

@reduxForm({
  form: 'clarifyAnswer',
  fields,
}, (state, prop) => ({
  initialValues: {
    cid: state.contest.getIn(['detail', 'cid']),
    qid: prop.formKey,
  },
}))
@withStyles(s)
export default class ClarifyForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  render() {
    const {
      fields: { answer },
      handleSubmit,
      submitting,
    } = this.props;
    const clear = () => answer.onChange('');
    return (
      <form onSubmit={handleSubmit(postContestAnswer(clear))}>
        <TextField
          multiLine
          fullWidth
          floatingLabelText="Post Answer"
          {...answer}
        />
        <RaisedButton
          disabled={submitting}
          primary
          type="submit"
          label="post"
        />
        <div style={{ clear: 'both' }}/>
      </form>
    );
  }
}
