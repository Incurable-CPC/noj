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
    sortBy: PropTypes.func.isRequired,
  };

  render() {
    const { problemList, sortBy } = this.props;
    const fields = ['pid', 'title', 'ratio', 'accepted', 'submit'];
    const headers = ['ID', 'Title', 'Ratio', 'AC', 'ALL'];
    const problemNodeList = problemList.map((problem, index) => {
      const ratio = problem.get('ratio').toFixed(2);
      const content = (
        <div>
          {fields.map((field) => (
            <span key={field} className={s[`${field}-col`]}>
              {(field !== 'ratio') ? problem.get(field) : `${ratio}%` }
            </span>
          ))}
        </div>
      );
      return (
        <div key={index}>
          <Divider />
          <ListItem
            style={{ background: '' }}
            primaryText={content}
            onTouchTap={() => Location.push(`/problems/${problem.get('pid')}`)}
          />
        </div>
      );
    });
    const header = (
      <div>
        {fields.map((field, index) => (
          <span className={s[`${field}-col`]} key={field}>
            <strong className={s.header} onClick={() => sortBy(field)}>
              {headers[index]}
            </strong>
          </span>
        ))}
      </div>
    );
    return (
      <List>
        <ListItem primaryText={header} disabled />
        {problemNodeList}
      </List>
    );
  }
}
