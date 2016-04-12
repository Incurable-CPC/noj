/**
 * Create by cpc on 2/21/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import moment from 'moment';

import withStyle from '../decorators/withStyles';
import ProblemList from './Lists/ProblemList.jsx';
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
    const problemList = contest.get('problems')
      .map((problem) => {
        const url = `/contests/${cid}/problems/${problem.get('pid')}`;
        return problem.set('url', url);
      });

    return (
      <div className={s.contest}>
        <div className={s.title}>
          <div>
            <h1>{contest.get('title')}</h1>
          </div>
          <div>
            <span className={s.center}>
              Start Time: {start.format('YYYY-MM-DD HH:ss')}
            </span>
            <span className={s.center}>
              End Time: {end.format('YYYY-MM-DD HH:ss')}
            </span>
          </div>
        </div>
        <div className={s.problems}>
          <ProblemList problemList={problemList} />
        </div>
      </div>
    );
  }
}
