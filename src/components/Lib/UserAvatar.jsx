/**
 * Create by cpc on 5/26/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Avatar from 'material-ui/Avatar';

import Location from '../../core/Location';

const styles = {
  avatar: { cursor: 'pointer' },
};

export default class UserAvatar extends Component {
  static propTypes = {
    user: ImmutableTypes.map.isRequired,
    size: PropTypes.number.isRequired,
  };

  render() {
    const { user, size } = this.props;
    const { info: { avatar }, username } = user.toJS();
    return (
      <Avatar
        style={styles.avatar}
        onTouchTap={() => Location.push(`/users/${username}`)}
        src={avatar}
        size={size}
      />
    );
  }
}
