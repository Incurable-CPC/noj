/**
 * Create by cpc on 3/30/16.
 **/

import React, { Component, PropTypes } from 'react';
import TextField from '../../../node_modules/material-ui/lib/text-field';
import DatePicker from '../../../node_modules/material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker';
import moment from 'moment';

export default class DateTimePicker extends Component {
  static propTypes = {
    format: PropTypes.string.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  state = {
    value: undefined,
  };

  getDate = () => (this.props.value || this.state.value);

  handleChange = (date) => {
    this.setState({ value: date });
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
            mode="landscape"
            ref="datepicker"
            onChange={this.changeDate}
          />
          <TimePicker
            autoOk
            format="24hr"
            ref="timepicker"
            onChange={this.changeTime}
          />
        </div>
      </div>
    );
  }
}
