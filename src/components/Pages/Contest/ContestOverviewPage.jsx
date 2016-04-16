/**
 * Create by cpc on 4/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import { connect } from 'react-redux';

import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import Contest from '../../Contest.jsx';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect((state) => ({
  contest: state.contest.get('detail'),
}))
export default class ContestOverviewPage extends Component {
  static propTypes = {
    contest: ImmutableTypes.map.isRequired,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { contest } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <Contest contest={contest} />
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
