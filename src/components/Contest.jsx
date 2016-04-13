/**
 * Create by cpc on 2/21/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import LinearProgress from 'material-ui/lib/linear-progress';
import moment from 'moment';

import withStyle from '../decorators/withStyles';
import ProblemList from './Lists/ProblemList.jsx';
import Time from './Lib/Time.jsx';
import s from './Contest.scss';

@withStyle(s)
export default class Contest extends Component {
  static propTypes = {
    contest: ImmutableTypes.map.isRequired,
  };

  render() {
    let { contest } = this.props;
    const cid = contest.get('cid');
    const start = moment(contest.get('start'));
    const duration = Number(contest.get('duration'));
    const end = moment(start).add(duration, 'hours');
    let progress = 0;
    // if (cur.isAfter(end)) {
    //   progress = 100;
    // } else if (cur.isAfter(start)) {
    //   progress = 100 * cur.diff(start) / end.diff(start);
    // } else {
    //   progress = 0;
    // }
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
            Current Time: <Time />
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
