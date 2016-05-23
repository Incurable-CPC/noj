/**
 * Create by cpc on 5/23/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import { grey500 } from 'material-ui/styles/colors';

const styles = {
  container: {
    textAlign: 'center',
    padding: 20,
  },
  username: { fontSize: 20 },
  avatar: { padding: 5 },
  content: {
    marginTop: 20,
    fontSize: 14,
  },
  info: { color: grey500 },
  count: { margin: 10 },
};

export default class UserInfoBox extends Component {
  static propTypes = {
    user: ImmutableTypes.map.isRequired,
  };

  render() {
    const { user } = this.props;
    return (
      <Paper style={styles.container}>
        <div style={styles.avatar}>
          <Avatar src={user.getIn(['info', 'avatar'])} size={96}/>
        </div>
        <div style={styles.username}>{user.get('username')}</div>
        <div style={styles.content}>
          <div>
            <span style={styles.count}>
              <span style={styles.info}>Solved: </span>
              {user.get('solved').size}
            </span>
            <span style={styles.count}>
              <span style={styles.info}>Tried: </span>
              {user.get('tried').size}
            </span>
          </div>
        </div>
      </Paper>
    );
  }
}
