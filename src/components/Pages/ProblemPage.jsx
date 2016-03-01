/**
 * Create by cpc on 1/13/16.
 **/

import React, { Component } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/lib/raised-button';

import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import Location from '../../core/Location';
import Problem from '../Problem.jsx';
import SubmissionForm from '../Forms/SubmissionForm.jsx';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect((state) => ({
  problem: state.problem,
}))
export default class ProblemPage extends Component {
  static propTypes = {
    problem: ImmutableTypes.map.isRequired,
  };

  render() {
    const { problem } = this.props;
    let buttons = ['status', 'statistics', 'discuss', 'edit'];
    buttons = buttons.map((action, index) => (
      <RaisedButton
        style={{ marginLeft: 1 }}
        onTouchTap={() => Location.push(`/problems/${problem.get('pid')}/${action}`)}
        key={index}
        label={action}
      />
    ));

    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <Problem problem={problem} />
            <div style={{ textAlign: 'center' }}>
              {buttons}
            </div>
            <div style={{ marginTop: 40 }}>
              <SubmissionForm problem={problem} />
            </div>
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
