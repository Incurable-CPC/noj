/**
 * Create by cpc on 2/17/16.
 **/

import React, { Component } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import TextField from 'material-ui/TextField';


export default class Test extends Component {
  static propTypes = {
    users: ImmutableTypes.list,
  };

  state = {
    value: '',
  }

  shouldComponentUpdate() {
    console.trace();
    return false;
  }

  _handleChange = (evt, value) => {
    console.trace();
    this.setState({ value });
  }

  render() {
    return (
      <div>
        <TextField name="a" onChange={this._handleChange} />
      </div>
    );
  }
}
