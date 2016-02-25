/**
 * Create by cpc on 1/13/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';

import { getProblem } from '../../actions/ProblemActions';
import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import Problem from '../Problem.jsx';
import SubmissionForm from '../Forms/SubmissionForm.jsx';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect((state) => ({ problem: state.problem }))
export default class ProblemPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    problem: ImmutableTypes.map.isRequired,
    params: PropTypes.object,
  };

  componentWillMount() {
    const { dispatch, params: { pid } } = this.props;
    dispatch(getProblem(pid));
  }

  render() {
    const { problem } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <Problem problem={problem} />
            <SubmissionForm problem={problem}/>
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
