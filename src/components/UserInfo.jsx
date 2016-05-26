/**
 * Create by cpc on 5/25/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';

export default class UserInfo extends Component {
  static propTypes = {
    user: ImmutableTypes.map.isRequired,
  };

  render() {
    const { user } = this.props;
    return <div>{user.get('username')}</div>;
  }
}
