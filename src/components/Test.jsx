/**
 * Create by cpc on 2/17/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import UserList from './Lists/UserList';
import { connect } from 'react-redux';

import { getUserList } from '../actions/userActions';

@connect(state => ({
  users: state.user.get('list'),
}))
export default class Test extends Component {
  static propTypes = {
    users: ImmutableTypes.list,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    this.props.dispatch(getUserList());
  }

  render() {
    const { users } = this.props;
    return (
      <div>
        <UserList userList={users}/>
      </div>
    );
  }
}
