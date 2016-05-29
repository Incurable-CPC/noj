/**
 * Create by cpc on 2/21/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import LinearProgress from 'material-ui/LinearProgress';
import moment from 'moment';

import withStyle from '../decorators/withStyles';
import withTime from '../decorators/withTime';
import ProblemList from './Lists/ProblemList.jsx';
import s from './Contest.scss';
import { formatTime } from '../core';

@withTime()
@withStyle(s)
class TimeInfo extends Component {
  static propTypes = {
    contest: ImmutableTypes.map.isRequired,
    time: PropTypes.object.isRequired,
  };
  render() {
    let { contest, time } = this.props;
    const start = moment(contest.get('start'));
    const duration = Number(contest.get('duration'));
    const end = moment(start).add(duration, 'hours');
    let progress = 0;
    if (time.isAfter(end)) {
      progress = 100;
    } else if (time.isAfter(start)) {
      progress = 100 * time.diff(start) / end.diff(start);
    } else {
      progress = 0;
    }
    return (
      <div>
        <div>
            <span className={s.center}>
              Start Time: {formatTime(start)}
            </span>
            <span className={s.center}>
              End Time: {formatTime(end)}
            </span>
        </div>
        <div>
          Current Time: {formatTime(time)}
        </div>
        <div className={s.timebar}>
          <LinearProgress mode="determinate" value={progress} />
        </div>
      </div>
    );
  }
}

@withStyle(s)
export default class Contest extends Component {
  static propTypes = {
    username: PropTypes.string,
    contest: ImmutableTypes.map.isRequired,
  };

  render() {
    let { contest, username } = this.props;
    const cid = contest.get('cid');
    const team = contest.getIn(['teams', username]);
    const problemList = contest.get('problems')
      .map((problem, index) => {
        const pid = String.fromCharCode(index + 'A'.charCodeAt(0));
        const url = `/contests/${cid}/problems/${pid}`;
        let status = '';
        if (team && team.hasIn(['problems', index, 'solved'])) {
          status = 'solved';
        } else if (team && team.hasIn(['problems', index, 'failed'])) {
          status = 'tried';
        }
        return problem
          .set('status', status)
          .set('pid', pid)
          .set('url', url);
      });

    return (
      <div className={s.contest}>
        <div className={s.title}>
          <div>
            <h1>{contest.get('title')}</h1>
          </div>
          <TimeInfo contest={contest} />
        </div>
        <div className={s.problems}>
          <ProblemList problemList={problemList} />
        </div>
      </div>
    );
  }
}
