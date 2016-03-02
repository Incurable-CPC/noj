/**
 * Create by cpc on 2/28/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import FlatButton from 'material-ui/lib/flat-button';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import Paper from 'material-ui/lib/paper';
import moment from 'moment';

import CodeBlock from '../CodeBlock.jsx';
import Animate from '../Animate.jsx';
import cs from 'classnames';
import s from './SubmissionList.scss';
import withStyles from '../../decorators/withStyles';
import Location from '../../core/Location';
import { LANGUAGES, RESULTS } from '../../constants';

@withStyles(s)
export default class SubmissionList extends Component {
  static propTypes = {
    submissionList: ImmutableTypes.list.isRequired,
    expandSubmission: PropTypes.func.isRequired,
  };

  render() {
    const { submissionList, expandSubmission } = this.props;
    const submissionNodeList = submissionList.map((submission, index) => {
      const {
        sid, pid, username, language,
        result, date, codeLength,
        code, expanded,
        } = submission.toJS();
      const content = (
        <div className={s.row}>
          <span className={cs(s.col, s.id)}>
            {sid}
          </span>
          <span className={cs(s.col, s.problem)}>
            <FlatButton
              style={{ textTransform: '' }}
              onTouchTap={() => Location.push(`/problems/${pid}`)}
              label={pid}
            />
          </span>
          <span className={cs(s.col, s.username)}>
            <FlatButton
              style={{ textTransform: '' }}
              onTouchTap={() => ({})}
              label={username}
            />
          </span>
          <span className={cs(s.col, s.result)}>
            {RESULTS[result]}
          </span>
          <span className={cs(s.col, s.memory)}>
            --
          </span>
          <span className={cs(s.col, s.time)}>
            --
          </span>
          <span className={cs(s.col, s.language)}>
            <FlatButton
              style={{ textTransform: '' }}
              onTouchTap={() => expandSubmission(index)}
              label={LANGUAGES[language]}
            />
          </span>
          <span className={cs(s.col, s.length)}>
            {codeLength}
          </span>
          <span className={cs(s.col, s.date)}>
            {moment(date).format('YYYY-MM-DD hh:mm:ss')}
          </span>
        </div>
      );
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
            {expanded ? (
              <Paper className={s.code}>
                <CodeBlock code={code} language={language} />
              </Paper>
            ) : null}
          </Animate>
        </div>
      );
    });
    const header = (
      <div className={s.row}>
          <span className={cs(s.col, s.id)}>
            <strong>#</strong>
          </span>
          <span className={cs(s.col, s.problem)}>
            <strong>Problem</strong>
          </span>
          <span className={cs(s.col, s.username)}>
            <strong>User</strong>
          </span>
          <span className={cs(s.col, s.result)}>
            <strong>Result</strong>
          </span>
          <span className={cs(s.col, s.memory)}>
            <strong>Memory</strong>
          </span>
          <span className={cs(s.col, s.time)}>
            <strong>Time</strong>
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
