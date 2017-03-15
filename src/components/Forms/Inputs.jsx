/**
 * Create by cpc on 12/03/2017.
 **/

import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import CodeMirror from 'react-codemirror';

import DateTimePicker from '../Lib/DateTimePicker.jsx';

class InputComponent extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }),
  };
}

export class SelectInput extends InputComponent
{
  render() {
    const {
      input, label,
      meta: { touched, error },
      ...rest,
    } = this.props;
    return (
      <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        {...rest}
      />
    );
  }
}

export class CodeInput extends InputComponent {
  render() {
    const { input, ...rest } = this.props;
    return (
      <CodeMirror
        onChange={(val) => input.onChange(val)}
        {...rest}
      />
    );
  }
}

export class TextInput extends InputComponent {
  render() {
    const {
      input, label,
      meta: { touched, error },
      ...rest,
    } = this.props;
    return (
      <TextField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...rest}
      />
    );
  }
}

export class DataTimeInput extends InputComponent {
  render() {
    const { input, label, meta, dateTimeFormat, ...rest } = this.props;
    return (
      <DateTimePicker
        floatingLabelText={label}
        onChange={(evt, date) => input.onChange(date)}
        format={dateTimeFormat}
        {...rest}
      />
    );
  }
}

