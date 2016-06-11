/**
 * Create by cpc on 5/25/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { is } from 'immutable';

import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import { followUser } from '../../../actions/user';
import UserInfoBox from '../../SideBoxes/UserInfoBox';
import UserInfo from '../../UserInfo';
import BasePage from '../BasePage';

@withTitle('NOJ - User')
@withStyles(s)
@connect((state) => ({
  authedUser: state.auth,
  user: state.user.get('detail'),
}))
export default class UserInfoPage extends BasePage {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authedUser: ImmutableTypes.map,
    user: ImmutableTypes.map,
    params: PropTypes.object,
  };

  render() {
    let {
      params: { username },
      authedUser, user,
      dispatch,
    } = this.props;
    if ((!username) || (!user)) user = authedUser;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <UserInfo
              user={user}
              self={user.get('username') === authedUser.get('username')}
              follow={() => dispatch(followUser(true))}
              unfollow={() => dispatch(followUser(false))}
            />
          </Paper>
        </div>
        <div className={s.right}>
          <UserInfoBox user={authedUser}/>
        </div>
      </div>
    );
  }
}
