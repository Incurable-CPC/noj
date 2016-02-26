/**
 * Create by cpc on 1/13/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/lib/raised-button';

import { showDialog, hideDialog } from '../../actions/DialogActions';
import { getProblem } from '../../actions/ProblemActions';
import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import Location from '../../core/Location';
import Problem from '../Problem.jsx';
import SubmissionDialog from '../Dialogs/SubmissionDialog.jsx';
import SubmissionForm from '../Forms/SubmissionForm.jsx';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect((state) => ({
  problem: state.problem,
  dialog: state.dialog,
}))
export default class ProblemPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    dialog: PropTypes.string.isRequired,
    problem: ImmutableTypes.map.isRequired,
    params: PropTypes.object,
  };

  componentWillMount() {
    const { dispatch, params: { pid } } = this.props;
    dispatch(getProblem(pid));
  }

  render() {
    const { dispatch, problem, dialog } = this.props;
    let buttons = ['status', 'statistics', 'discuss', 'edit'];
    buttons = buttons.map((action, index) => (
      <RaisedButton
        style={{ marginLeft: 1 }}
        onTouchTap={() => Location.push(`/problems/${problem.get('pid')}/${action}`)}
        key={index}
        label={action}
      />
    ));
    const submitButton = (
      <RaisedButton
        style={{ marginLeft: 1 }}
        onTouchTap={() => dispatch(showDialog('submission'))}
        secondary
        label="submit"
      />
    );

    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <Problem problem={problem} />
            <div style={{ textAlign: 'center' }}>
              {submitButton}
              {buttons}
            </div>
          </Paper>
        </div>
        <div className={s.right}>
          <Paper className={s.paper} style={{ height: 250 }}>
            TEST
          </Paper>
        </div>
        <SubmissionDialog
          open={dialog === 'submission'}
          hide={() => dispatch(hideDialog())}
          problem={problem}
        />
      </div>
    );
  }
}
