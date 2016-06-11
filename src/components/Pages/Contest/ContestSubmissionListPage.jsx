/**
 * Create by cpc on 1/12/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import { expandContestSubmission } from '../../../actions/contest';
import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import SubmissionList from '../../Lists/SubmissionList';
import BasePage from '../BasePage';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect(state => ({
  submissionList: state.contest.getIn(['detail', 'submissions']),
}))
export default class SubmissionListPage extends BasePage {
  static propTypes = {
    submissionList: ImmutableTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  render() {
    let { submissionList, dispatch, params: { cid } } = this.props;
    const count = submissionList.size;
    submissionList = submissionList.reverse().take(20)
      .map((submission, index) => submission
        .set('sid', 9999 + count - index)
        .set('problemUrl', `/contests/${cid}/problems/${submission.get('pid')}`)
      );
    const boundExpand = (index, content) =>
      dispatch(expandContestSubmission(index, content));
    return (
      <div className={s.div}>
        <Paper className={s.paper}>
          <SubmissionList
            expandSubmission={boundExpand}
            submissionList={submissionList}
          />
        </Paper>
      </div>
    );
  }
}
