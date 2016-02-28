/**
 * Create by cpc on 1/12/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import { connect } from 'react-redux';

import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import ProblemTable from '../Lists/ProblemList.jsx';
import Location from '../../core/Location';
import { getProblemList } from '../../actions/ProblemListActions';

@withTitle('NOJ - Problems')
@withStyles(s)
@connect(state => ({ problemList: state.problemList }))
class ProblemsListPage extends Component {
  static propTypes = {
    problemList: ImmutableTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getProblemList());
  }

  render() {
    const { problemList } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <ProblemTable problemList={problemList}/>
            <RaisedButton label="ADD" onTouchTap={() => Location.push('/problems/add')} />
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
