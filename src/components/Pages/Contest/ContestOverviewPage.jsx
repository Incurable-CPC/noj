/**
 * Create by cpc on 4/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from '../../../../node_modules/material-ui/lib/paper';
import { connect } from 'react-redux';
import moment from 'moment';
import RaisedButton from 'material-ui/lib/raised-button';

import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import Location from '../../../core/Location';
import Contest from '../../Contest.jsx';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect((state) => ({
  contest: state.contest.get('detail'),
  time: state.time,
}))
export default class ContestOverviewPage extends Component {
  static propTypes = {
    contest: ImmutableTypes.map.isRequired,
    time: PropTypes.string.isRequired,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { contest, time } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <Contest contest={contest} cur={moment(time)} />
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
