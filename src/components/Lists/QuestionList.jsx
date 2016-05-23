/**
 * Create by cpc on 5/15/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Divider from 'material-ui/Divider';
import moment from 'moment';
import { grey100, grey500 } from 'material-ui/styles/colors';

import ClarificationForm from '../Forms/ClarificationForm.jsx';

const styles = {
  content: {
    padding: 8,
    paddingLeft: 12,
    backgroundColor: grey100,
    borderRadius: 10,
  },
  info: {
    fontSize: 12,
    color: grey500,
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
        <div key={index} style={{ paddingBottom: 4 }}>
            {multiLines(answer.get('content'))}
            <div style={styles.info}>
              from {answer.get('username')}
              , {moment(answer.get('time')).format('YYYY-MM-DD hh:mm:ss')}
            </div>
          </div>
        );
      });
    const { username, time, qid } = question.toJS();
    return (
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div style={{ paddingBottom: 4 }}>
          <strong>Question:</strong>
          <div style={styles.content}>
            {multiLines(question.get('content'))}
            <div style={styles.info}>
              from {username}, {moment(time).format('YYYY-MM-DD hh:mm:ss')}
            </div>
          </div>
        </div>
        <div>
          <strong>Answer(s):</strong>
          <div style={styles.content}>
            {answerNodeList}
          </div>
        </div>
        {isManager && <ClarificationForm formKey={qid.toString()} />}
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
          <Question isManager={isManager} question={question} />
          <Divider />
        </div>);
    return (
      <div>
        {questionNodeList}
      </div>
    );
  }
}
