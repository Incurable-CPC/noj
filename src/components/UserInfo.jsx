/**
 * Create by cpc on 5/25/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import * as colors from 'material-ui/styles/colors';
import { DeviceAccessTime, CommunicationEmail, ActionHome } from 'material-ui/svg-icons';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';

import UserAvatar from './Lib/UserAvatar';
import { formatTime, nameToStr } from '../core';
import Location from '../core/Location';

const leftWidth = 180;
const styles = {
  username: {
    fontSize: 28,
    paddingLeft: 20,
  },
  left: {
    float: 'left',
    textAlign: 'center',
    minWidth: leftWidth,
  },
  right: { paddingLeft: leftWidth + 40 },
  info: {
    color: colors.grey500,
    fontSize: 10,
  },
  count: {
    paddingTop: 10,
    paddingBottom: 10,
    float: 'left',
    width: '50%',
  },
  problems: {
    clear: 'both',
    paddingTop: 20,
  },
};

export default class UserInfo extends Component {
  static propTypes = {
    user: ImmutableTypes.map.isRequired,
    unfollow: PropTypes.func.isRequired,
    follow: PropTypes.func.isRequired,
    self: PropTypes.bool,
  };

  state = {
    inside: false,
  };

  _handleMouseEnter = () => this.setState({ inside: true });
  _handleMouseLeave = () => this.setState({ inside: false });

  render() {
    const { user, self, follow, unfollow } = this.props;
    const showCount = (field, index) => (
      <span key={index} style={styles.count}>
        {user.get(`${field}Cnt`)}
        <br />
        <span style={styles.info}>{nameToStr(field)}</span>
      </span>
    );
    const showPid = (solved) => (pid, index) => (
      <FlatButton
        key={index}
        label={pid}
        primary={solved}
        secondary={!solved}
        labelStyle={styles.pid}
        onTouchTap={() => Location.push(`/problems/${pid}`)}
      />
    );
    const buttonProps = [() => ({
      label: 'edit profile',
      onTouchTap: () => Location.push('/settings'),
    }), () => ({
      label: 'follow',
      onTouchTap: follow,
    }), () => this.state.inside ? ({
      secondary: true,
      label: 'unfollow',
      onTouchTap: unfollow,
    }) : ({
      primary: true,
      label: 'following',
    })];
    let buttonId = self ? 0 : 1;
    if (user.get('isFollowing')) buttonId = 2;
    return (
      <div>
        <div style={styles.left}>
          <UserAvatar user={user} size={128} />
          <div>
            {['followers', 'following'].map(showCount)}
          </div>
          <RaisedButton
            onMouseEnter={this._handleMouseEnter}
            onMouseLeave={this._handleMouseLeave}
            {...buttonProps[buttonId]()}
          />
        </div>
        <div style={styles.right}>
          <div style={styles.username}>
            {user.get('username')}
          </div>
          <div>
            <List>
              <ListItem
                primaryText={user.getIn(['info', 'school'])}
                leftIcon={<ActionHome />}
              />
              <ListItem
                primaryText={user.getIn(['info', 'email'])}
                leftIcon={<CommunicationEmail />}
              />
              <ListItem
                primaryText={`register: ${formatTime(user.get('registerTime'))}`}
                leftIcon={<DeviceAccessTime />}
              />
            </List>
          </div>
        </div>
        <div style={styles.problems}>
          <Paper style={{ padding: 20 }}>
            Problems solved:
            <div>
              {user.get('solved').map(showPid(true))}
            </div>
            <div style={{ height: 40 }} />
            Problems tried but unsolved:
            <div>
              {user.get('notSolved').map(showPid(false))}
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}
