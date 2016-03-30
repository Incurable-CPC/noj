/**
 * Create by cpc on 3/27/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import DateTimePicker from '../Lib/DateTimePicker.jsx';
import RaisedButton from 'material-ui/lib/raised-button';

import { postContest } from '../../actions/ContestActions';
import s from './EditForm.scss';
import withStyles from '../../decorators/withStyles';

const fields = [
  'cid',
  'title',
  'start',
  'duration',
];

@reduxForm({
  form: 'contestEdit',
  fields,
}, (state) => ({ initialValues: state.contest.get('detail').toJS() }))
@withStyles(s)
export default class ContestEditForm extends Component {
  static propTypes = {
    action: PropTypes.string,
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  render() {
    const {
      fields: { title, duration, start },
      handleSubmit,
      submitting,
      action,
    } = this.props;
    start.value = start.value || start.initialValue;
    const startDate = start.value && new Date(start.value);
    return (
      <form className={s.form} onSubmit={handleSubmit(postContest)}>
        <div>
          <TextField
            floatingLabelText="Title"
            {...title}
          />
          <DateTimePicker
            floatingLabelText="Start Time"
            format="YYYY-MM-DD HH:mm"
            value={startDate}
            onChange={(evt, date) => start.onChange(date)}
          />
          <div>
            <TextField
              floatingLabelText="Duration"
              {...duration}
            />
          </div>
        </div>
        <div className={s.action}>
          <RaisedButton
            secondary
            type="submit"
            label={action}
            disabled={submitting}
          />
        </div>
      </form>
    );
  }
}
