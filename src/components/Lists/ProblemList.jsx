/**
 * Create by cpc on 1/11/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

import withStyles from '../../decorators/withStyles';
import s from './ProblemList.scss';
import Location from '../../core/Location';

@withStyles(s)
export default class ProblemList extends Component {
  static propTypes = {
    problemList: ImmutableTypes.list.isRequired,
    sortBy: PropTypes.func,
  };

  render() {
    const { problemList, sortBy } = this.props;
    const fields = ['pid', 'title', 'ratio', 'accepted', 'submit'];
    const headers = ['ID', 'Title', 'Ratio', 'AC', 'ALL'];
    const problemNodeList = problemList.map((problem, index) => {
      const showProblem = problem
        .update('ratio', (ratio) => `${ratio.toFixed(2)}%`);
      const pid = problem.get('pid');
      const url = problem.get('url') || `/problems/${pid}`;
      const content = (
        <div>
          {fields.map((field) => (
            <span key={field} className={s[`${field}-col`]}>
              {showProblem.get(field)}
            </span>
          ))}
        </div>
      );
      return (
        <div key={index}>
          <Divider />
          <ListItem
            className={s[problem.get('status')]}
            style={{ background: '' }}
            primaryText={content}
            onTouchTap={() => Location.push(url)}
          />
        </div>
      );
    });
    const header = (
      <div>
        {fields.map((field, index) => (
          <span className={s[`${field}-col`]} key={field}>
            {sortBy ? (
              <strong className={s.header} onClick={() => sortBy(field)}>
                {headers[index]}
              </strong>
            ) : <strong>{headers[index]}</strong>}
          </span>
        ))}
      </div>
    );
    return (
      <List className={s.list}>
        <ListItem primaryText={header} disabled />
        {problemNodeList}
      </List>
    );
  }
}
