/**
 * Create by cpc on 2/21/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import LinearProgress from 'material-ui/lib/linear-progress';
import moment from 'moment';

import withStyle from '../decorators/withStyles';
import withTime from '../decorators/withTime';
import ProblemList from './Lists/ProblemList.jsx';
import s from './Contest.scss';

@withTime()
@withStyle(s)
export default class Contest extends Component {
  static propTypes = {
    contest: ImmutableTypes.map.isRequired,
    time: PropTypes.object.isRequired,
  };

  render() {
    let { contest, time } = this.props;
    const cid = contest.get('cid');
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
    const problemList = contest.get('problems')
      .map((problem, index) => {
        const pid = String.fromCharCode(index + 'A'.charCodeAt(0));
        const url = `/contests/${cid}/problems/${pid}`;
        return problem.set('pid', pid).set('url', url);
      });

    return (
      <div className={s.contest}>
        <div className={s.title}>
          <div>
            <h1>{contest.get('title')}</h1>
          </div>
          <div>
            <span className={s.center}>
              Start Time: {start.format('YYYY-MM-DD HH:mm')}
            </span>
            <span className={s.center}>
              End Time: {end.format('YYYY-MM-DD HH:mm')}
            </span>
          </div>
          <div>
            Current Time: {time.format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
        <div className={s.problems}>
          <LinearProgress mode="determinate" value={progress} />
          <br/>
          <ProblemList problemList={problemList} />
        </div>
      </div>
    );
  }
}
