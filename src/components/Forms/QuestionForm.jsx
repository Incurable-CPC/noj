/**
 * Create by cpc on 5/14/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import s from './EditForm.scss';
import withStyles from '../../decorators/withStyles';
import { postContestQuestion } from '../../actions/contestActions';

const fields = ['cid', 'question'];

@reduxForm({
  form: 'clarify',
  fields,
}, (state) => ({
  initialValues: { cid: state.contest.getIn(['detail', 'cid']) },
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
      fields: { question },
      handleSubmit,
      submitting,
    } = this.props;
    const clear = () => question.onChange('');
    return (
      <form onSubmit={handleSubmit(postContestQuestion(clear))}>
        <div>
          <TextField
            fullWidth
            multiLine
            rows={3}
            floatingLabelText="Post New Question"
            {...question}
          />
        </div>
        <div className={s.action}>
          <RaisedButton
            primary
            type="submit"
            label="Post"
            disabled={submitting}
          />
        </div>
        <div style={{ clear: 'both' }}/>
      </form>
    );
  }
}
