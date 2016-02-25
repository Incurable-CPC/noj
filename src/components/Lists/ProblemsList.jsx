/**
 * Create by cpc on 1/11/16.
 **/

import React, { Component } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

import withStyles from '../../decorators/withStyles';
import s from './ProblemsList.scss';
import Location from '../../core/Location';

@withStyles(s)
export default class ProblemsTable extends Component {
  static propTypes = {
    problemList: ImmutableTypes.list.isRequired,
  };

  render() {
    const { problemList } = this.props;
    const problemNodeList = problemList.map((problem, index) => {
      const { pid, title, submit, accepted } = problem.toJS();
      const ratio = ((submit > 0) ? (100 * accepted / submit) : 0);
      const content = (
        <div>
          <span className={s['id-col']}>{pid}</span>
          <span className={s['title-col']}>
            {title}
          </span>
          <span className={s['ratio-col']}>
            {ratio}%({accepted}/{submit})
          </span>
        </div>
      );
      return (
        <div key={index}>
          <Divider />
          <ListItem
            style={{ background: '' }}
            primaryText={content}
            onTouchTap={() => Location.push(`/problems/${pid}`)}
          />
        </div>
      );
    });
    const header = (
      <div>
        <span className={s['id-col']}><strong>ID</strong></span>
        <span className={s['title-col']}><strong>Title</strong></span>
        <span className={s['ratio-col']}><strong>Ratio(AC/submit)</strong></span>
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
