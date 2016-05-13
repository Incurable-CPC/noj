/**
 * Create by cpc on 2/28/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import FlatButton from 'material-ui/FlatButton';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import List from 'material-ui/List/List';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment';

import CodeBlock from '../Lib/CodeBlock.jsx';
import Animate from '../Lib/Animate.jsx';
import cs from 'classnames';
import s from './SubmissionList.scss';
import withStyles from '../../decorators/withStyles';
import Location from '../../core/Location';
import { LANGUAGES, RESULTS } from '../../constants';
import { isCompleted, isCompileError, isAccepted } from '../../check/submission';

const styles = {
  label: { textTransform: null },
};

@withStyles(s)
export default class SubmissionList extends Component {
  static propTypes = {
    submissionList: ImmutableTypes.list.isRequired,
    expandSubmission: PropTypes.func.isRequired,
    withoutPid: PropTypes.bool,
  };

  state = {
    showCEInfo: [],
  };

  render() {
    const { submissionList, expandSubmission, withoutPid } = this.props;
    const submissionNodeList = submissionList.map((submission, index) => {
      const {
        sid, pid, username, language,
        result, date, codeLength,
        code, originOJ, CEInfo,
        } = submission.toJS();
      const problemUrl = submission.get('problemUrl') || `/problems/${pid}`;
      const expandedContent = submission.get('content');
      let status = 'other';
      if (isAccepted(result)) status = 'accepted';
      if (isCompileError(result)) status = 'compile-error';
      const content = (
        <div className={cs(s.row, withoutPid ? s['without-pid'] : s.normal)}>
          <span className={cs(s.col, s.id)}>
            {sid}
          </span>
          {withoutPid ? null : (
            <span className={cs(s.col, s.problem)}>
              <FlatButton
                labelStyle={styles.label}
                onTouchTap={() => Location.push(problemUrl)}
                label={pid}
              />
            </span>
          )}
          <span className={cs(s.col, s.username)}>
            <FlatButton
              labelStyle={styles.label}
              onTouchTap={() => ({})}
              label={username}
            />
          </span>
          <span className={cs(s.col, s.result)}>
            {isCompleted(result) ?
              <span className={s[`status-${status}`]}>
                {isCompileError(result) ? (
                  <span onClick={() => expandSubmission(index, 'CEInfo')}>
                    {RESULTS[result]}
                  </span>
                ) : RESULTS[result]}
              </span> :
              <CircularProgress size={0.4} />
            }
          </span>
          <span className={cs(s.col, s.time)}>
            {submission.has('timeUsage') ?
              `${submission.get('timeUsage')}ms` :
              '--'}
          </span>
          <span className={cs(s.col, s.memory)}>
            {submission.has('memoryUsage') ?
              `${submission.get('memoryUsage')}KB` :
              '--'}
          </span>
          <span className={cs(s.col, s.language)}>
            <FlatButton
              style={{ textTransform: '' }}
              onTouchTap={() => expandSubmission(index, 'code')}
              label={LANGUAGES[originOJ][language]}
            />
          </span>
          <span className={cs(s.col, s.length)}>
            {codeLength}
          </span>
          <span className={cs(s.col, s.date)}>
            {moment(date).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
      );
      let expanded = null;
      if (expandedContent === 'code') {
        expanded = (
          <div className={s.code}>
            <Paper>
              <CodeBlock code={code} OJ={originOJ} language={language} />
            </Paper>
          </div>
        );
      } else if (expandedContent === 'CEInfo') {
        expanded = (
          <div className={s.code}>
            <Paper>
              <CodeBlock code={CEInfo} OJ={originOJ} language={language} />
            </Paper>
          </div>
        );
      }

      return (
        <div key={index}>
          <Divider />
          <ListItem
            style={{ background: '' }}
            innerDivStyle={{ paddingTop: 4, paddingBottom: 4 }}
            primaryText={content}
            disabled
          />
          <Divider />
          <Animate name="code" style={s} >
            {expanded}
          </Animate>
        </div>
      );
    });
    const header = (
      <div className={cs(s.row, withoutPid ? s['without-pid'] : s.normal)}>
        <span className={cs(s.col, s.id)}>
          <strong>#</strong>
        </span>
        {withoutPid ? null : (
          <span className={cs(s.col, s.problem)}>
            <strong>Problem</strong>
          </span>
        )}
        <span className={cs(s.col, s.username)}>
          <strong>User</strong>
        </span>
        <span className={cs(s.col, s.result)}>
          <strong>Result</strong>
        </span>
        <span className={cs(s.col, s.time)}>
          <strong>Time</strong>
        </span>
        <span className={cs(s.col, s.memory)}>
          <strong>Memory</strong>
        </span>
        <span className={cs(s.col, s.language)}>
          <strong>Language</strong>
        </span>
        <span className={cs(s.col, s.length)}>
          <strong>Length</strong>
        </span>
        <span className={cs(s.col, s.date)}>
          <strong>Date</strong>
        </span>
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
