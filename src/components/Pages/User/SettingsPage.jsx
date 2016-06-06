/**
 * Create by cpc on 6/5/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import { postAvatar } from '../../../actions/userActions';
import UserInfoBox from '../../SideBoxes/UserInfoBox';
import UserInfoForm from '../../Forms/User/UserInfoForm';
import AvatarForm from '../../Forms/User/AvatarForm';
import BasePage from '../BasePage';

@withTitle('NOJ - Settings')
@withStyles(s)
@connect((state) => ({
  user: state.auth,
}))
export default class UserInfoPage extends BasePage {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: ImmutableTypes.map,
    params: PropTypes.object,
  };

  render() {
    const { user, dispatch } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper} >
            <AvatarForm
              src={user.getIn(['info', 'avatar'])}
              postAvatar={async (_) => await dispatch(postAvatar(_))}
            />
          </Paper>
          <Paper className={s.paper} >
            <UserInfoForm username={user.get('username')} />
          </Paper>
        </div>
        <div className={s.right}>
          <UserInfoBox user={user}/>
        </div>
      </div>
    );
  }
}
