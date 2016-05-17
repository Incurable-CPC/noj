/**
 * Create by cpc on 5/15/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import TextField from 'material-ui/TextField';

class Question extends Component {
  static propTypes = {
    isManager: PropTypes.bool.isRequired,
    question: ImmutableTypes.map.isRequired,
  };

  state = {
    answer: '',
  };

  _onChange = (evt) => this.setState({ answer: evt.target.value });

  render() {
    const { question, isManager } = this.props;
    const lines = (question.get('question') || '')
      .split('\n').map((line, index) =>
        <span key={index}>{line}<br/></span>);
    const answerForm = (
      <div>
        <TextField
          multiLine
          floatingLabelText="Post Answer"
          value={this.state.answer}
          onChange={this._onChange}
        />
      </div>
    );
    return (
      <div style={{ paddingTop: 40 }}>
        <div>
          <strong>Question:</strong>
          <div style={{ padding: 8 }}>
            {lines}
          </div>
          <div style={{ fontSize: 12 }}>
            from team: {question.get('username')}
          </div>
        </div>
        <div>
          <strong>Answer(s):</strong>
        </div>
        {isManager && answerForm}
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
      questionList.reverse().map((question, index) =>
        <Question
          isManager={isManager}
          question={question}
          key={index}
        />);
    return (
      <div>
        {questionNodeList}
      </div>
    );
  }
}
