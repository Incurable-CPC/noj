/**
 * Create by cpc on 2/17/16.
 **/

import React, { Component } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';

import Board from '../../Board.jsx';
import s from '../common.scss';
import cx from 'classnames';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect(state => ({
  problems: state.contest.getIn(['detail', 'problems']),
  teams: state.contest.getIn(['detail', 'teams']),
}))
export default class ContestBoardPage extends Component {
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
