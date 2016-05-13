/**
 * Create by cpc on 3/29/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import moment from 'moment';

import withStyles from '../../decorators/withStyles';
import cs from 'classnames';
import s from './ContestList.scss';
import Location from '../../core/Location';

@withStyles(s)
export default class ProblemList extends Component {
  static propTypes = {
    contestList: ImmutableTypes.list.isRequired,
    sortBy: PropTypes.func.isRequired,
  };

  render() {
    const { contestList, sortBy } = this.props;
    const fields = ['cid', 'title', 'start', 'duration'];
    const headers = ['ID', 'Title', 'Start Time', 'Duration'];
    const contestNodeList = contestList.map((contest, index) => {
      const cid = contest.get('cid');
      const showContest = contest
        .update('start', (start) => moment(start).format('YYYY-MM-DD hh:mm'))
        .update('duration', (duration) => (duration > 24) ?
          `${(duration / 24).toFixed(1)} days` :
          `${duration} hours`);
      const content = (
        <div className={s.row}>
          {fields.map((field) => (
            <span key={field} className={cs(s.col, s[`${field}-col`])}>
              {showContest.get(field)}
            </span>
          ))}
        </div>
      );
      return (
        <div key={index}>
          <Divider />
          <ListItem
            primaryText={content}
            onTouchTap={() => Location.push(`/contests/${cid}`)}
          />
        </div>
      );
    });
    const header = (
      <div className={s.row}>
        {fields.map((field, index) => (
          <span className={cs(s.col, s[`${field}-col`])} key={field}>
            <strong className={s.header} onTouchTap={() => sortBy(field)}>
              {headers[index]}
            </strong>
          </span>
        ))}
      </div>
    );
    return (
      <List className={s.list}>
        <ListItem primaryText={header} disabled />
        {contestNodeList}
      </List>
    );
  }
}
