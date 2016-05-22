/**
 * Create by cpc on 1/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { List } from 'immutable';
import { connect } from 'react-redux';

import s from './common.scss';
import Pagination from '../Lib/Pagination.jsx';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import ProblemList from '../Lists/ProblemList.jsx';
import SearchBar from '../Lib/SearchBar.jsx';
import Location from '../../core/Location';
import { api } from '../../config';
import { postJSON } from '../../core/fetchJSON';
import { getProblemListSortBy, getProblemListByKeyword } from '../../actions/problemActions';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect(state => ({
  problemList: state.problem.get('list'),
  count: state.problem.get('count'),
  page: state.problem.getIn(['condition', 'page']),
  searchKey: state.problem.getIn(['condition', 'searchKey']),
  solved: state.auth.get('solved'),
  tried: state.auth.get('tried'),
}))
class ProblemsListPage extends Component {
  static propTypes = {
    problemList: ImmutableTypes.list.isRequired,
    searchKey: PropTypes.string,
    solved: ImmutableTypes.list,
    tried: ImmutableTypes.list,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { count, page, dispatch, searchKey } = this.props;
    const tried = (this.props.tried || new List()).toJS();
    const solved = (this.props.solved || new List()).toJS();
    const pagination = [];
    const begin = Math.max(1, Math.min(page - 2, count - 4));
    const end = Math.min(count, begin + 4);
    const pageUrl = (pageId) => `/problems/page/${pageId}`;
    for (let index = begin; index <= end; index++) {
      pagination.push({
        content: `${index}`,
        href: pageUrl(index),
      });
    }

    const first = { content: 'first', href: pageUrl(1) };
    const last = { content: 'last', href: pageUrl(count) };
    const previous = {
      content: '<',
      href: pageUrl(Math.max(1, page - 1)),
    };
    const next = {
      content: '>',
      href: pageUrl(Math.min(page + 1, count)),
    };

    const problemList = this.props.problemList.map((problem) => {
      const pid = problem.get('pid');
      let ret = problem.set('statu', 'normal');
      if (tried.indexOf(pid) >= 0) ret = ret.set('status', 'tried');
      if (solved.indexOf(pid) >= 0) ret = ret.set('status', 'solved');
      return ret;
    });
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <SearchBar
              initialValue={searchKey}
              search={(key) => dispatch(getProblemListByKeyword(key))}
              width={320}
            />
            <div style={{ textAlign: 'center' }}>
              <Pagination
                current={`${page}`}
                list={[first, previous].concat(pagination, [next, last])}
              />
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
              onTouchTap={() => postJSON(`${api}/problems/poj`)}
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
