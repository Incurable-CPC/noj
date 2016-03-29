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

  changeStartTime = (evt, date) => {
    const { fields: { start } } = this.props;
    const newDate = moment(start.value);
    newDate.hour(date.getHours());
    newDate.minute(date.getMinutes());
    newDate.second(0);
    newDate.millisecond(0);
    start.onChange(newDate);
  };

  changeStartDate = (evt, date) => {
    const { fields: { start } } = this.props;
    const newDate = moment(start.value);
    newDate.year(date.getFullYear());
    newDate.month(date.getMonth());
    newDate.date(date.getDate());
    start.onChange(newDate);
  };

  render() {
    const {
      fields: { title, duration, start },
      handleSubmit,
      submitting,
      action,
    } = this.props;
    const startDate = { onChange: this.changeStartDate };
    const startTime = { onChange: this.changeStartTime };
    const value = start.value || start.initialValue;
    if (value) {
      startDate.value = startTime.defaultTime =
        moment(value).toDate();
    }
    return (
      <form className={s.form} onSubmit={handleSubmit(postContest)}>
        <div>
          <TextField
            floatingLabelText="Title"
            {...title}
          />
          <div style={{ paddingTop: 24 }}>
            <DatePicker
              autoOk
              mode="landscape"
              hintText="Start Date"
              style={{ display: 'inline-block', width: 150, marginRight: 60 }}
              formatDate={(date) => moment(date).format('YYYY-MM-DD')}
              {...startDate}
            />
            <TimePicker
              autoOk
              mode="landscape"
              format="24hr"
              hintText="Time"
              style={{ display: 'inline-block', width: 150 }}
              {...startTime}
            />
          </div>
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
