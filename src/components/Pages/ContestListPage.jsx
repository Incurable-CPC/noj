/**
 * Create by cpc on 3/28/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';

import { getContestListSortBy, getContestListByKeyword } from '../../actions/contest';
import Location from '../../core/Location';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import s from './common.scss';
import ContestList from '../Lists/ContestList';
import Pagination from '../Lib/Pagination';
import SearchBar from '../Lib/SearchBar';
import BasePage from './BasePage';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect(state => ({
  searchKey: state.contest.getIn(['condition', 'searchKey']),
  contestList: state.contest.get('list'),
  count: state.contest.get('count'),
  page: state.contest.getIn(['condition', 'page']),
}))
class ContestListPage extends BasePage {
  static propTypes = {
    contestList: ImmutableTypes.list.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    searchKey: PropTypes.string,
  };

  render() {
    const { count, page, dispatch, contestList, searchKey } = this.props;
    const begin = Math.max(1, Math.min(page - 2, count - 4));
    const end = Math.min(count, begin + 4);
    const paginationRange = {
      begin, end, count, page,
      href: '/contests/page',
    };
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <SearchBar
              initialValue={searchKey}
              search={(key) => dispatch(getContestListByKeyword(key))}
              width={280}
            />
            <div style={{ textAlign: 'center' }}>
              <Pagination range={paginationRange} />
            </div>
            <ContestList
              contestList={contestList}
              sortBy={(key) => dispatch(getContestListSortBy(key))}
            />
            <RaisedButton
              label="ADD"
              onTouchTap={() => Location.push('/contests/add')}
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

export default ContestListPage;
