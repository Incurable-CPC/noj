/**
 * Create by cpc on 1/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';

import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import SubmissionList from '../../Lists/SubmissionList.jsx';
import { expandSubmission } from '../../../actions/SubmissionActions';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect(state => ({
  submissionList: state.contest.getIn(['detail', 'submissions']),
}))
export default class SubmissionListPage extends Component {
  static propTypes = {
    submissionList: ImmutableTypes.list.isRequired,
    params: PropTypes.object.isRequired,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    let { submissionList, params: { cid } } = this.props;
    submissionList = submissionList
      .map((submission, index) => submission
        .set('sid', index + 10000)
        .set('problemUrl', `/contests/${cid}/problems/${submission.get('pid')}`)
      );
    return (
      <div className={s.div}>
        <Paper className={s.paper}>
          <SubmissionList
            expandSubmission={() => {}}
            submissionList={submissionList}
          />
        </Paper>
      </div>
    );
  }
}
