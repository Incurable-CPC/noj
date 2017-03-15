/**
 * Create by cpc on 2/17/16.
 **/

import React from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import s from '../common.scss';
import cx from 'classnames';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import Board from '../../Board';
import BasePage from '../BasePage';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect(state => ({
  problems: state.getIn(['contest', 'detail', 'problems']),
  teams: state.getIn(['contest', 'detail', 'teams']),
}))
export default class ContestBoardPage extends BasePage {
  static propTypes = {
    problems: ImmutableTypes.list,
    teams: ImmutableTypes.map,
  };

  render() {
    const { problems, teams } = this.props;
    return (
      <div className={s.board}>
        <Paper className={cx(s.paper, s.container)}>
          <Board
            problems={problems}
            teams={teams}
          />
        </Paper>
      </div>
    );
  }
}
