/**
 * Create by cpc on 5/23/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { grey500 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import UserAvatar from '../Lib/UserAvatar';
import Location from '../../core/Location';
import { nameToStr } from '../../common';

const styles = {
  container: { padding: 20 },
  center: { textAlign: 'center' },
  username: { fontSize: 20 },
  avatar: { padding: 5 },
  content: {
    marginTop: 20,
    fontSize: 14,
  },
  info: { color: grey500 },
  count: { margin: 10 },
  pid: {
    textTransform: null,
    padding: 4,
  },
};

export default class UserInfoBox extends Component {
  static propTypes = {
    user: ImmutableTypes.map.isRequired,
  };

  render() {
    const { user } = this.props;
    const username = user.get('username');
    const notSolved = user.get('notSolved');
    const showCount = (field, index) => (
      <span key={index} style={styles.count}>
        <span style={styles.info}>{nameToStr(field)}: </span>
        {user.get(field).size}
      </span>
    );
    const showPid = (pid, index) => (
      <FlatButton
        key={index}
        label={pid}
        secondary
        labelStyle={styles.pid}
        onTouchTap={() => Location.push(`/problems/${pid}`)}
      />
    );
    return (
      <Paper style={styles.container}>
        <div style={styles.center}>
          <div style={styles.avatar}>
            <UserAvatar user={user} size={96} />
          </div>
          <div style={styles.username}>{username}</div>
          <div style={styles.content}>
            <div>
              {['tried', 'solved'].map(showCount)}
            </div>
          </div>
        </div>
        {(notSolved.size > 0) && (
          <div style={styles.content}>
            <div style={styles.info}>Problems tried but unsolved:</div>
            <div>
              {notSolved.map(showPid)}
            </div>
          </div>
        )}
      </Paper>
    );
  }
}
