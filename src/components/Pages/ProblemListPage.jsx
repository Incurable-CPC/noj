/**
 * Create by cpc on 1/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import { connect } from 'react-redux';

import s from './common.scss';
import Pagination from '../Pagination.jsx';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import ProblemList from '../Lists/ProblemList.jsx';
import Location from '../../core/Location';
import { postJSON } from '../../core/fetchJSON';
import { getProblemListSortBy } from '../../actions/ProblemActions';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect(state => ({
  problemList: state.problem.get('list'),
  count: state.problem.get('count'),
  page: state.problem.getIn(['condition', 'page']),
  solved: state.auth.get('solved'),
  tried: state.auth.get('tried'),
}))
class ProblemsListPage extends Component {
  static propTypes = {
    problemList: ImmutableTypes.list.isRequired,
    solved: ImmutableTypes.list.isRequired,
    tried: ImmutableTypes.list.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { count, page, dispatch, tried, solved } = this.props;
    const pagination = [];
    const begin = Math.max(1, Math.min(page - 2, count - 4));
    const end = Math.min(count, begin + 4);
    for (let index = begin; index <= end; index++) {
      pagination.push({
        isCurrent: index === page,
        content: `${index}`,
        href: `/problems/page/${index}`,
      });
    }

    const first = { content: 'first', href: '/problems' };
    const last = { content: 'last', href: `/problems/page/${count}` };
    const previous = {
      content: '<',
      href: `/problems/page/${Math.max(1, page - 1)}`,
    };
    const next = {
      content: '>',
      href: `/problems/page/${Math.min(page + 1, count)}`,
    };

    const problemList = this.props.problemList.map((problem) => {
      const pid = problem.get('pid');
      let ret = problem.set('statu', 'normal');
      if (tried.toJS().indexOf(pid) >= 0) ret = ret.set('status', 'tried');
      if (solved.toJS().indexOf(pid) >= 0) ret = ret.set('status', 'solved');
      return ret;
    });
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <div>
              <Pagination list={[first, previous].concat(pagination, [next, last])} />
            </div>
            <ProblemList
              problemList={problemList}
              sortBy={(key) => dispatch(getProblemListSortBy(key))}
            />
            <RaisedButton
              label="ADD"
              onTouchTap={() => Location.push('/problems/add')}
            />
            <RaisedButton
              label="add from poj"
              onTouchTap={() => postJSON('/api/problems/poj')}
            />
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

export default ProblemsListPage;
