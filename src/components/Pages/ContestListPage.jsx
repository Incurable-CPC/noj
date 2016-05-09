/**
 * Create by cpc on 3/28/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import { connect } from 'react-redux';

import s from './common.scss';
import ContestList from '../Lists/ContestList.jsx';
import Pagination from '../Lib/Pagination.jsx';
import SearchBar from '../Lib/SearchBar.jsx';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import Location from '../../core/Location';
import { getContestListSortBy, getContestListByKeyword } from '../../actions/contestActions';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect(state => ({
  searchKey: state.contest.getIn(['condition', 'searchKey']),
  contestList: state.contest.get('list'),
  count: state.contest.get('count'),
  page: state.contest.getIn(['condition', 'page']),
}))
class ContestListPage extends Component {
  static propTypes = {
    contestList: ImmutableTypes.list.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    searchKey: PropTypes.string,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { count, page, dispatch, contestList, searchKey } = this.props;
    const pagination = [];
    const begin = Math.max(1, Math.min(page - 2, count - 4));
    const end = Math.min(count, begin + 4);
    const pageUrl = (pageId) => `/contests/page/${pageId}`;
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
              <Pagination
                list={[first, previous].concat(pagination, [next, last])}
                current={`${page}`}
              />
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
