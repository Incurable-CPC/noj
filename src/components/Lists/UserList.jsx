/**
 * Create by cpc on 6/3/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import cs from 'classnames';

import Avatar from '../Lib/Avatar';
import Location from '../../core/Location';
import withStyle from '../../decorators/withStyles';
import s from './UserList.scss';

@withStyle(s)
export default class UserList extends Component {
  static propTypes = {
    userList: ImmutableTypes.list,
  };

  render() {
    const { userList } = this.props;
    const fields = ['username', 'nick', 'solved'];
    const headers = ['Username', 'Nick', 'Solved'];
    const userNodeList = userList.map((user, index) => {
      const content = (
        <div className={s.row}>
          {fields.map((field) => (
            <span key={field} className={cs(s.col, s[`${field}-col`])}>
              {user.get(field)}
            </span>
          ))}
        </div>
      );
      return (
        <div key={index}>
          <Divider />
          <ListItem
            leftAvatar={<Avatar src={user.get('avatar')} />}
            onTouchTap={() => Location.push(`/users/${user.get('username')}`)}
            primaryText={content}
          />
        </div>
      );
    });
    const header = (
      <div className={s.row}>
        {fields.map((field, index) => (
          <span className={cs(s.col, s[`${field}-col`])} key={field}>
            <strong>{headers[index]}</strong>
          </span>
        ))}
      </div>
    );
    return (
      <List>
        <ListItem primaryText={header} disabled insetChildren/>
        <Divider />
        {userNodeList}
      </List>
    );
  }
}
