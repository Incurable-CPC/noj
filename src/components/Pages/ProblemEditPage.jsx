/**
 * Create by cpc on 1/13/16.
 **/

import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';

import { getProblem, initProblem } from '../../actions/ProblemActions';
import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import ProblemEditForm from '../Forms/ProblemEditForm.jsx';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect(() => ({}))
export default class ProblemEditPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object,
  };

  componentWillMount() {
    const { dispatch, params: { pid } } = this.props;
    if (pid) {
      dispatch(getProblem(pid));
    } else {
      dispatch(initProblem());
    }
  }

  render() {
    const { params: { pid } } = this.props;
    const action = pid ? 'save' : 'add';

    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <ProblemEditForm action={action} />
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
