/**
 * Create by cpc on 3/30/16.
 **/

import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

export default class DateTimePicker extends Component {
  static propTypes = {
    format: PropTypes.string.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  getDate = () => this.props.value;

  handleChange = (date) => {
    if (this.props.onChange) {
      this.props.onChange(null, date);
    }
  }

  changeTime = (evt, date) => {
    const newDate = moment(this.getDate());
    newDate.hour(date.getHours());
    newDate.minute(date.getMinutes());
    newDate.second(0);
    newDate.millisecond(0);
    this.handleChange(newDate.toDate());
  };

  changeDate = (evt, date) => {
    const newDate = moment(this.getDate());
    newDate.year(date.getFullYear());
    newDate.month(date.getMonth());
    newDate.date(date.getDate());
    this.handleChange(newDate.toDate());
    setTimeout(() => this.refs.timepicker.openDialog(), 0);
  };

  handleInputFocus = (evt) => evt.target.blur();
  handleInputTouchTap = () =>
    setTimeout(() => this.refs.datepicker.openDialog(), 0);

  render() {
    const date = this.getDate();
    let { value, format, ...others } = this.props;
    value = date && moment(date).format(format);
    return (
      <div>
        <TextField
          value={value}
          onFocus={this.handleInputFocus}
          onTouchTap={this.handleInputTouchTap}
          {...others}
        />
        <div style={{ display: 'none' }}>
          <DatePicker
            autoOk
            hintText="datepicker"
            mode="landscape"
            ref="datepicker"
            onChange={this.changeDate}
            value={date}
          />
          <TimePicker
            autoOk
            hintText="timepicker"
            format="24hr"
            ref="timepicker"
            onChange={this.changeTime}
            value={date}
          />
        </div>
      </div>
    );
  }
}
