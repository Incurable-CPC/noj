/**
 * Create by cpc on 5/15/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Divider from 'material-ui/Divider';
import moment from 'moment';

import AnswerForm from '../Forms/AnswerForm.jsx';

class Question extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    isManager: PropTypes.bool.isRequired,
    question: ImmutableTypes.map.isRequired,
  };

  state = {
    answer: '',
  };

  _onChange = (evt) => this.setState({ answer: evt.target.value });

  render() {
    const { question, isManager, index } = this.props;
    const lines = (question.get('question') || '')
      .split('\n').map((line, id) =>
        <span key={id}>{line}<br/></span>);
    const { username, time } = question.toJS();
    return (
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div style={{ paddingBottom: 4 }}>
          <strong>Question:</strong>
          <div style={{ padding: 8 }}>
            {lines}
          </div>
          <div style={{ fontSize: 12 }}>
            from {username}, {moment(time).format('YYYY-MM-DD hh:mm:ss')}
          </div>
        </div>
        <div>
          <strong>Answer(s):</strong>
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
