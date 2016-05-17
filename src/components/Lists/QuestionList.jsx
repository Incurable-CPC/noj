/**
 * Create by cpc on 5/15/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Divider from 'material-ui/Divider';
import moment from 'moment';
import { grey500 } from 'material-ui/styles/colors';

import AnswerForm from '../Forms/AnswerForm.jsx';

const styles = {
  info: {
    fontSize: 12,
    color: grey500,
  },
  grey: { color: grey500 },
};

class Question extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    isManager: PropTypes.bool.isRequired,
    question: ImmutableTypes.map.isRequired,
  };

  render() {
    const { question, isManager, index } = this.props;
    const questionLines = (question.get('question') || '')
      .split('\n').map((line, id) =>
        <span key={id}>{line}<br/></span>);
    const answerNodeList = (question.get('answers')).map((answer, id) => (
      <div key={id} style={{ paddingLeft: 8, paddingTop: 4 }}>
        {answer.get('answer')}
        <div style={styles.info}>
          from {answer.get('username')}
          , {moment(answer.get('time')).format('YYYY-MM-DD hh:mm:ss')}
        </div>
      </div>
    ));
    const { username, time } = question.toJS();
    return (
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div style={{ paddingBottom: 4 }}>
          <strong>Question:</strong>
          <div style={{ padding: 8 }}>
            {questionLines}
            <div style={styles.info}>
              from {username}, {moment(time).format('YYYY-MM-DD hh:mm:ss')}
            </div>
          </div>
        </div>
        <div>
          <strong>Answer(s):</strong>
          <div>{answerNodeList}</div>
        </div>
        {isManager && <AnswerForm formKey={index.toString()} />}
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
      questionList.map((question, index) =>
        <div key={index}>
          <Question
            index={index}
            isManager={isManager}
            question={question}
          />
          <Divider />
        </div>);
    return (
      <div>
        {questionNodeList}
      </div>
    );
  }
}
