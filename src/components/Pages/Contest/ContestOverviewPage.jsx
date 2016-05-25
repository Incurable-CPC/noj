/**
 * Create by cpc on 4/12/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import Contest from '../../Contest';
import BasePage from '../BasePage';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect((state) => ({
  username: state.auth.get('username'),
  contest: state.contest.get('detail'),
}))
export default class ContestOverviewPage extends BasePage {
  static propTypes = {
    contest: ImmutableTypes.map.isRequired,
    username: PropTypes.string,
  };

  render() {
    const { contest, username } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <Contest contest={contest} username={username}/>
          </Paper>
        </div>
        <div className={s.right}>
          <Paper className={s.paper} style={{ height: 250 }}>
            TEST
          </Paper>
        </div>
      </div>
    );
  }
}
