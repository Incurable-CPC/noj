/**
 * Create by cpc on 1/11/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import * as colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

import withStyles from '../../decorators/withStyles';
import s from './ProblemList.scss';
import cs from 'classnames';
import Location from '../../core/Location';

const styles = {
  solved: {
    backgroundColor: fade(colors.green100, 0.5),
  },
  tried: {
    backgroundColor: fade(colors.blue100, 0.5),
  },
};

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
        <div className={s.row}>
          {fields.map((field) => (
            <span key={field} className={cs(s.col, s[`${field}-col`])}>
              {showProblem.get(field)}
            </span>
          ))}
        </div>
      );
      return (
        <div key={index}>
          <Divider />
          <ListItem
            innerDivStyle={styles[problem.get('status')]}
            primaryText={content}
            onTouchTap={() => Location.push(url)}
          />
        </div>
      );
    });
    const header = (
      <div className={s.row}>
        {fields.map((field, index) => (
          <span className={cs(s.col, s[`${field}-col`])} key={field}>
            {sortBy ? (
              <strong className={s.header} onTouchTap={() => sortBy(field)}>
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
