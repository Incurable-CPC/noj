/**
 * Create by cpc on 5/15/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import { grey50, grey500 } from 'material-ui/styles/colors';

import ClarificationForm from '../Forms/ClarificationForm.jsx';
import { formatTime } from '../../common';

const styles = {
  content: {
    padding: '12px 20px',
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: grey50,
    // borderRadius: 10,
  },
  info: {
    paddingTop: 8,
    fontSize: 12,
    color: grey500,
    // textAlign: 'right',
  },
  paddingTop: { paddingTop: 20 },
  divider: {
    marginLeft: -30,
    marginRight: -40,
    marginTop: 10,
  },
};

const multiLines = (str) => {
  const lines = (str || '')
    .split('\n')
    .map((line, index) => <span key={index}>{line}<br/></span>);
  return <span>{lines}</span>;
};

class Question extends Component {
  static propTypes = {
    isManager: PropTypes.bool.isRequired,
    question: ImmutableTypes.map.isRequired,
  };

  render() {
    const { question, isManager } = this.props;
    const answers = question.get('answers');
    const answerNodeList = answers && answers.map((answer, index) => {
      return (
        <div key={index} style={index > 0 ? styles.paddingTop: {}}>
          {multiLines(answer.get('content'))}
          <div style={styles.info}>
            from {answer.get('username')}
            , {formatTime(answer.get('time'))}
          </div>
        </div>
      );
    });
    return (
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div style={{ paddingBottom: 4 }}>
          <strong>Question:</strong>
          <Paper style={styles.content}>
            {multiLines(question.get('content'))}
            <div style={styles.info}>
              from {question.get('username')}
              , {formatTime(question.get('time'))}
            </div>
          </Paper>
        </div>
        <div>
          <strong>Answer(s):</strong>
          <Paper style={styles.content}>
            {answerNodeList}
            {isManager && <ClarificationForm formKey={question.get('qid').toString()} />}
          </Paper>
        </div>
      </div>
    );
  }
}

export default class QuestionList extends Component {
  static propTypes = {
    isManager: PropTypes.bool.isRequired,
    questionList: ImmutableTypes.list,
  };

  render() {
    const { questionList, isManager } = this.props;
    const questionNodeList =
      questionList && questionList.reverse().map((question, index) =>
        <div key={index}>
          {(index > 0) && <Divider style={styles.divider} /> }
          <Question isManager={isManager} question={question} />
        </div>);
    return (
      <div>
        {questionNodeList}
      </div>
    );
  }
}
