/**
 * Create by cpc on 2/28/16.
 **/

import React, { Component } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import { Link } from 'react-router';
import moment from 'moment';

import s from './SubmissionList.scss';
import withStyles from '../../decorators/withStyles';
import { LANGUAGES } from '../../constants';

@withStyles(s)
export default class SubmissionList extends Component {
  static propTypes = {
    submissionList: ImmutableTypes.list.isRequired,
  };

  render() {
    const { submissionList } = this.props;
    const submissionNodeList = submissionList.map((submission, index) => {
      const { sid, pid, username, language, date } = submission.toJS();
      const content = (
        <div className={s.row}>
          <span onClick={() => Location.push('/')} className={s['id-col']}>
            {sid}
          </span>
          <span className={s['problem-col']}>
            <Link to={`problems/${pid}`}>{pid}</Link>
          </span>
          <span className={s['user-col']}>
            {username}
          </span>
          <span className={s['result-col']}>--</span>
          <span className={s['language-col']}>
            {LANGUAGES[language]}
          </span>
          <span className={s['date-col']}>
            {moment(date).format('YYYY-MM-DD hh:mm:ss')}
          </span>
        </div>
      );
      return (
        <div key={index}>
          <Divider />
          <ListItem
            style={{ background: '' }}
            innerDivStyle={{ paddingTop: 10, paddingBottom: 10 }}
            primaryText={content}
          />
        </div>
      );
    });
    const header = (
      <div className={s.row}>
        <span className={s['id-col']}><strong>#</strong></span>
        <span className={s['problem-col']}><strong>Problem</strong></span>
        <span className={s['user-col']}><strong>User</strong></span>
        <span className={s['result-col']}><strong>Result</strong></span>
        <span className={s['language-col']}><strong>Language</strong></span>
        <span className={s['date-col']}><strong>Date</strong></span>
      </div>
    );
    return (
      <List>
        <ListItem primaryText={header} disabled />
        {submissionNodeList}
      </List>
    );
  }
}
