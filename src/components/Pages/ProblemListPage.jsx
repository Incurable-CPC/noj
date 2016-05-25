/**
 * Create by cpc on 1/12/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { List } from 'immutable';
import { connect } from 'react-redux';

import { getProblemListSortBy, getProblemListByKeyword } from '../../actions/problemActions';
import { postJSON } from '../../core/fetchJSON';
import Location from '../../core/Location';
import { api } from '../../config';
import s from './common.scss';
import Pagination from '../Lib/Pagination.jsx';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import ProblemList from '../Lists/ProblemList';
import SearchBar from '../Lib/SearchBar';
import UserInfoBox from '../SideBoxes/UserInfoBox';
import BasePage from './BasePage';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect(state => ({
  problemList: state.problem.get('list'),
  count: state.problem.get('count'),
  page: state.problem.getIn(['condition', 'page']),
  searchKey: state.problem.getIn(['condition', 'searchKey']),
  solved: state.auth.get('solved'),
  tried: state.auth.get('tried'),
  user: state.auth,
}))
class ProblemsListPage extends BasePage {
  static propTypes = {
    problemList: ImmutableTypes.list.isRequired,
    searchKey: PropTypes.string,
    solved: ImmutableTypes.list,
    tried: ImmutableTypes.list,
    user: ImmutableTypes.map,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { count, page, dispatch, searchKey, user } = this.props;
    const tried = (this.props.tried || new List()).toJS();
    const solved = (this.props.solved || new List()).toJS();
    const begin = Math.max(1, Math.min(page - 2, count - 4));
    const end = Math.min(count, begin + 4);
    const paginationRange = {
      begin, end, count, page,
      href: '/problems/page',
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
              <Pagination range={paginationRange} />
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
          <Paper className={s.paper} style={{ height: 250, paddingBottom: 20 }}>
            TEST
          </Paper>
          {user.has('username') && <UserInfoBox user={user}/>}
        </div>
      </div>
    );
  }
}

export default ProblemsListPage;
