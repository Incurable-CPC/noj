/**
 * Create by cpc on 5/14/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import QuestionForm from '../../Forms/QuestionForm.jsx';
import QuestionList from '../../Lists/QuestionList.jsx';
import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect(state => ({
  admin: state.auth.get('admin'),
  username: state.auth.get('username'),
  manager: state.contest.getIn(['detail', 'manager']),
  questions: state.contest.getIn(['detail', 'questions']),
}))
export default class ContestClarifyPage extends Component {
  static propTypes = {
    questions: ImmutableTypes.list,
    username: PropTypes.string,
    manager: PropTypes.string,
  };

  render() {
    const { questions, username, manager, admin } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <QuestionForm />
          </Paper>
          <Paper className={s.paper}>
            <QuestionList
              isManager={(username === manager) || admin}
              questionList={questions}
            />
          </Paper>
        </div>
        <div className={s.right}>
          <Paper className={s.paper} style={{ height: 350 }}>
            TEST
          </Paper>
        </div>
      </div>
    );
  }
}
