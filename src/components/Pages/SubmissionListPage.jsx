/**
 * Create by cpc on 1/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';

import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import SubmissionList from '../Lists/SubmissionList.jsx';
import { getSubmissionList, expandSubmission } from '../../actions/SubmissionListActions';

@withTitle('NOJ - Submissions')
@withStyles(s)
@connect(state => ({ submissionList: state.submissionList }))
export default class SubmissionListPage extends Component {
  static propTypes = {
    submissionList: ImmutableTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object,
  };

  componentWillMount() {
    const { dispatch, params } = this.props;
    dispatch(getSubmissionList(params));
  }

  render() {
    const { submissionList, dispatch } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <SubmissionList
              expandSubmission={(index) => dispatch(expandSubmission(index))}
              submissionList={submissionList}
            />
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
