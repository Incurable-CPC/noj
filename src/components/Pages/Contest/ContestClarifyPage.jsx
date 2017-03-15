/**
 * Create by cpc on 5/14/16.
 **/

import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import s from '../common.scss';
import withTitle from '../../../decorators/withTitle';
import withStyles from '../../../decorators/withStyles';
import ClarificationForm from '../../Forms/ClarificationForm';
import QuestionList from '../../Lists/QuestionList';
import BasePage from '../BasePage';

@withTitle('NOJ - Contests')
@withStyles(s)
@connect(state => ({
  isAdmin: state.hasIn(['auth', 'admin']),
  username: state.getIn(['auth', 'username']),
  manager: state.getIn(['contest', 'detail', 'manager']),
  questions: state.getIn(['contest', 'detail', 'questions']),
}))
export default class ContestClarifyPage extends BasePage {
  static propTypes = {
    questions: ImmutableTypes.list,
    username: PropTypes.string,
    manager: PropTypes.string,
    isAdmin: PropTypes.bool,
  };

  render() {
    const { questions, username, manager, isAdmin } = this.props;
    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <ClarificationForm qid={-1} form="clarification-1"/>
          </Paper>
          <Paper className={s.paper}>
            <QuestionList
              isManager={(username === manager) || isAdmin}
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
