/**
 * Create by cpc on 3/27/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker';
import RaisedButton from 'material-ui/lib/raised-button';
import moment from 'moment';

import { postContest } from '../../actions/ContestActions';
import s from './ProblemEditForm.scss';
import withStyles from '../../decorators/withStyles';

const fields = [
  'sid',
  'title',
  'start',
  'length',
];

@reduxForm({ form: 'contestEdit', fields })
@withStyles(s)
export default class ContestEditForm extends Component {
  static propTypes = {
    action: PropTypes.string,
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  changeStartTime = (evt, date) => {
    const { fields: { start } } = this.props;
    const newDate = start.value || moment();
    newDate.setHours(date.getHours());
    newDate.setMinutes(date.getMinutes());
    start.onChange(newDate);
  };

  changeStartDate = (evt, date) => {
    const { fields: { start } } = this.props;
    const newDate = start.value || new Date();
    newDate.setYear(date.getFullYear());
    newDate.setMonth(date.getMonth());
    newDate.setDate(date.getDate());
    start.onChange(newDate);
  };

  render() {
    const {
      fields: { title, length },
      handleSubmit,
      submitting,
    } = this.props;
    return (
      <form className={s.form} onSubmit={handleSubmit(postContest)}>
        <div>
          <TextField
            floatingLabelText="Title"
            {...title}
          />
          <div style={{ paddingTop: 24 }}>
            <DatePicker
              mode="landscape"
              hintText="Start Date"
              style={{ display: 'inline-block', width: 150, marginRight: 60 }}
              formatDate={(date) => moment(date).format('YYYY-MM-DD')}
              onChange={this.changeStartDate}
            />
            <TimePicker
              format="24hr"
              hintText="Time"
              style={{ display: 'inline-block', width: 150 }}
              onChange={this.changeStartTime}
            />
          </div>
          <div>
            <TextField
              floatingLabelText="Length"
              {...length}
            />
          </div>
        </div>
        <div className={s.action}>
          <RaisedButton
            secondary
            type="submit"
            label="add"
            disabled={submitting}
          />
        </div>
      </form>
    );
  }
}
