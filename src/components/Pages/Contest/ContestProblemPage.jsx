/**
 * Create by cpc on 4/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/lib/raised-button';

import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import Location from '../../../core/Location';
import Problem from '../../Problem.jsx';
import Pagination from '../../Lib/Pagination.jsx';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect((state) => {
  const contest = state.contest.get('detail');
  return {
    problems: contest.get('problems'),
    cid: contest.get('cid'),
    pid: contest.get('pid'),
  };
})
export default class ContestProblemPage extends Component {
  static propTypes = {
    problems: ImmutableTypes.list.isRequired,
    pid: PropTypes.string.isRequired,
    cid: PropTypes.number.isRequired,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { problems, cid, pid } = this.props;
    const index = pid.charCodeAt(0) - 'A'.charCodeAt(0);
    const problem = problems.get(index);
    const pagination = problems.map((prob, idx) => {
      let content = String.fromCharCode(idx + 'A'.charCodeAt(0));
      return {
        content,
        href: `/contests/${cid}/problems/${content}`,
      };
    }).toJS();
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <div className={s.center}>
              <Pagination list={pagination} current={pid} />
            </div>
            <Problem problem={problem} />
          </Paper>
        </div>
        <div className={s.right}>
          <Paper className={s.paper} style={{ height: 250 }}>
            TEST
          </Paper>
        </div>
      </div>
    );
  }
}
