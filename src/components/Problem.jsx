/**
 * Create by cpc on 2/21/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import * as colors from 'material-ui/styles/colors';
import { fromJS } from 'immutable';

import { nameToStr } from '../core';
import { handleProblemSrc } from '../check/problem';
import withStyle from '../decorators/withStyles';
import s from './Problem.scss';

const styles = {
  info: {
    fontSize: 12,
    color: colors.grey600,
  },
};

@withStyle(s)
export default class Problem extends Component {
  static propTypes = {
    editing: PropTypes.bool,
    problem: ImmutableTypes.map.isRequired,
  };

  render() {
    const { editing } = this.props;
    let { problem } = this.props;
    if (editing) {
      problem = fromJS(handleProblemSrc(problem.toJS()));
    }

    const renderField = (field) => (problem.get(field) &&
      <div>
        <h3>{nameToStr(field)}</h3>
        <div
          className={s.content}
          dangerouslySetInnerHTML={{ __html: problem.get(field) }}
        />
      </div>
    );
    return (
      <div className={s.problem}>
        <div className={s.title}>
          <div>
            <h1>{problem.get('title')}</h1>
          </div>
          <div style={styles.info}>
            <span className={s.center}>
              Time Limit: {problem.get('timeLimit')}
            </span>
            <span className={s.center}>
              Memory Limit: {problem.get('memoryLimit')}
            </span>
          </div>
        </div>
        {renderField('description')}
        {renderField('input')}
        {renderField('output')}
        <div>
          <h3>Sample(s)</h3>
          {problem.get('samples').map((sample, index) => (
            <div key={index} className={s.sample}>
              <strong>Input #{index + 1}</strong>
              <pre className={s.pre}>{sample.get('input')}</pre>
              <strong>Output #{index + 1}</strong>
              <pre className={s.pre}>{sample.get('output')}</pre>
            </div>
          ))}
        </div>
        {renderField('hint')}
        {renderField('source')}
      </div>
    );
  }
}
