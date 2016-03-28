/**
 * Create by cpc on 1/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';

import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import SubmissionList from '../Lists/SubmissionList.jsx';
import { expandSubmission } from '../../actions/SubmissionActions';
import Location from '../../core/Location';

@withTitle('NOJ - Status')
@withStyles(s)
@connect(state => ({
  submissionList: state.submission.get('list'),
  problem: state.problem.get('detail'),
}))
export default class SubmissionListPage extends Component {
  static propTypes = {
    submissionList: ImmutableTypes.list.isRequired,
    problem: ImmutableTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { submissionList, problem, dispatch, params: { pid } } = this.props;
    const submissionListNode = (
      <SubmissionList
        expandSubmission={(index, content) => dispatch(expandSubmission(index, content))}
        submissionList={submissionList}
        withoutPid={Boolean(pid)}
      />
    );
    return (
      <div className={s.div}>
        {pid ? (
          <div>
            <div className={s['left-bg']}>
              <Paper className={s.paper}>
                <FlatButton
                  onTouchTap={() => Location.push(`/problems/${pid}`)}
                  label={`${pid} - ${problem.get('title')}`}
                  labelStyle={{ fontSize: 20 }}
                  style={{ textTransform: '' }}
                />
                {submissionListNode}
              </Paper>
            </div>
            <div className={s['right-sm']}>
              <Paper className={s.paper} style={{ height: 250 }}>
                TEST
              </Paper>
            </div>
          </div>
        ) : (
          <Paper className={s.paper}>
            {submissionListNode}
          </Paper>
        )}
      </div>
    );
  }
}
