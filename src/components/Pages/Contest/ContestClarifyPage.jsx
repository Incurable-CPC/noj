/**
 * Create by cpc on 5/14/16.
 **/

import React, { Component } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import QuestionForm from '../../Forms/QuestionForm';
import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect(state => ({
  problems: state.contest.getIn(['detail', 'problems']),
  teams: state.contest.getIn(['detail', 'teams']),
}))
export default class ContestClarifyPage extends Component {
  static propTypes = {
    problems: ImmutableTypes.list,
    teams: ImmutableTypes.map,
  };

  render() {
    // const { problems, teams } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <QuestionForm />
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
