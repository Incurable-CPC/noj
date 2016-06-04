/**
 * Create by cpc on 1/12/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

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
  page: state.user.getIn(['condition', 'page']),
  // searchKey: state.problem.getIn(['condition', 'searchKey']),
  // solved: state.auth.get('solved'),
  // tried: state.auth.get('tried'),
  user: state.auth,
}))
class UserListPage extends BasePage {
  static propTypes = {
    userList: ImmutableTypes.list.isRequired,
    // searchKey: PropTypes.string,
    // user: ImmutableTypes.map,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    // dispatch: PropTypes.func.isRequired,
  };

  render() {
    const {
      count, page, userList,
      user,
    } = this.props;
    const begin = Math.max(1, Math.min(page - 2, count - 4));
    const end = Math.min(count, begin + 4);
    const paginationRange = {
      begin, end, count, page,
      href: '/problems/page',
    };
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
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
