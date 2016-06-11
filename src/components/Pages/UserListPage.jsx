/**
 * Create by cpc on 1/12/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import { getUserFollowingList } from '../../actions/user';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import s from './common.scss';
import Pagination from '../Lib/Pagination.jsx';
import UserList from '../Lists/UserList';
// import SearchBar from '../Lib/SearchBar';
import UserInfoBox from '../SideBoxes/UserInfoBox';
import BasePage from './BasePage';

@withTitle('NOJ - Users')
@withStyles(s)
@connect(state => ({
  userList: state.user.get('list'),
  count: state.user.get('count'),
  condition: state.user.get('condition'),
  user: state.auth,
}))
class UserListPage extends BasePage {
  static propTypes = {
    userList: ImmutableTypes.list.isRequired,
    user: ImmutableTypes.map,
    count: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    condition: PropTypes.object.isRequired,
  };

  state = {
    updating: false,
  };

  _handleCheck = async (evt, checked) => {
    const { user, dispatch } = this.props;
    if (!user) return;
    const username = checked ? user.get('username') : null;
    this.setState({ updating: true });
    await dispatch(getUserFollowingList(username));
    this.setState({ updating: false });
  };

  render() {
    const {
      count, condition, userList,
      user,
    } = this.props;
    const { page, follower } = condition.toJS();
    const begin = Math.max(1, Math.min(page - 2, count - 4));
    const end = Math.min(count, begin + 4);
    const paginationRange = {
      begin, end, count, page,
      href: '/standing/page',
    };
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            {user &&
            <Checkbox
              label="Following Only"
              defaultChecked={Boolean(follower)}
              onCheck={this._handleCheck}
              disabled={this.state.updating}
            />}
            <div style={{ textAlign: 'center' }}>
              <Pagination range={paginationRange} />
            </div>
            <UserList userList={userList} />
          </Paper>
        </div>
        <div className={s.right}>
          <Paper className={s.paper} style={{ height: 250, paddingBottom: 20 }}>
            TEST
          </Paper>
          {user.has('username') && <UserInfoBox user={user}/>}
        </div>
      </div>
    );
  }
}

export default UserListPage;
