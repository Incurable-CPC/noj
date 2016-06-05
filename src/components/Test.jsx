/**
 * Create by cpc on 2/17/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import FileInput from './Lib/FileInput';

@connect(state => ({
  users: state.user.get('list'),
}))
export default class Test extends Component {
  static propTypes = {
    users: ImmutableTypes.list,
  };

  state = {
    files: null,
  }

  _handleChange = (files) => {
    this.setState({ files });
  }

  render() {
    return (
      <div>
        <FileInput multiple style={{ maxWidth: 240 }}/>
      </div>
    );
  }
}
