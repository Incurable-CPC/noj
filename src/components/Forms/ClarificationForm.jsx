/**
 * Create by cpc on 5/14/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import s from './EditForm.scss';
import withStyles from '../../decorators/withStyles';
import { clarifyContest } from '../../actions/contest';

const fields = ['cid', 'qid', 'content'];

@reduxForm({
  form: 'clarification',
  fields,
}, (state, prop) => ({
  initialValues: {
    cid: state.contest.getIn(['detail', 'cid']),
    qid: prop.formKey,
  },
}))
@withStyles(s)
export default class ClarificationForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    formKey: PropTypes.string.isRequired,
  };

  render() {
    const {
      fields: { content },
      handleSubmit,
      submitting,
      formKey,
    } = this.props;
    const clear = () => content.onChange('');
    const label = (Number(formKey) < 0) ? 'Question' : 'Answer';
    return (
      <form onSubmit={handleSubmit(clarifyContest(clear))}>
        <div>
          <TextField
            multiLine
            fullWidth
            floatingLabelText={label}
            {...content}
          />
        </div>
        <div className={s.action}>
          <RaisedButton
            disabled={submitting}
            primary
            type="submit"
            label="post"
          />
        </div>
        <div style={{ clear: 'both' }}/>
      </form>
    );
  }
}
