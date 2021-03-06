/**
 * Create by cpc on 1/12/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { List } from 'immutable';
import { connect } from 'react-redux';

import { getProblemListSortBy, getProblemListByKeyword } from '../../actions/problem';
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
  problemList: state.getIn(['problem', 'list']),
  count: state.getIn(['problem', 'count']),
  page: state.getIn(['problem', 'condition', 'page']),
  searchKey: state.getIn(['problem', 'condition', 'searchKey']),
  user: state.get('auth'),
}))
class ProblemsListPage extends BasePage {
  static propTypes = {
    problemList: ImmutableTypes.list.isRequired,
    searchKey: PropTypes.string,
    solved: ImmutableTypes.set,
    tried: ImmutableTypes.set,
    user: ImmutableTypes.map,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const {
      count, page, searchKey, user,
      dispatch,
    } = this.props;
    const tried = user.get('tried');
    const solved = user.get('solved');
    const begin = Math.max(1, Math.min(page - 2, count - 4));
    const end = Math.min(count, begin + 4);
    const paginationRange = {
      begin, end, count, page,
      href: '/problems/page',
    };
    const problemList = this.props.problemList.map((problem) => {
      const pid = problem.get('pid');
      let status = 'normal';
      if (tried && tried.includes(pid)) status = 'tried';
      if (solved && solved.includes(pid)) status = 'solved';
      return problem.set('status', status);
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
